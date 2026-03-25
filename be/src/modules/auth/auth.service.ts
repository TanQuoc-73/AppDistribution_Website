import { Injectable, UnauthorizedException, ConflictException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  private readonly supabase: SupabaseClient;
  // Simple in-memory rate limiter for password reset requests (per email)
  private static resetRequestTimestamps = new Map<string, number>();
  private static readonly RESET_RATE_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.supabase = createClient(
      this.config.get<string>('supabase.url')!,
      this.config.get<string>('supabase.serviceRoleKey')!,
    );
  }

  async signUp(dto: SignUpDto) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      user_metadata: { username: dto.username },
      email_confirm: false,
    });
    if (error?.code === '23505') throw new ConflictException('Email already exists');
    if (error) throw new UnauthorizedException(error.message);
    return { message: 'Account created. Please verify your email.', userId: data.user?.id };
  }

  async signIn(dto: SignInDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });
    if (error) throw new UnauthorizedException('Invalid credentials');

    // Enforce single concurrent session:
    // Save the new session's iat (issued-at) to the profile.
    // JwtAuthGuard will reject tokens whose iat is older than last_login_at.
    const session = data.session;
    if (session?.access_token && data.user?.id) {
      const iat = this.decodeJwtIat(session.access_token);
      if (iat) {
        // Update last_login_at (best-effort, don't fail sign-in if this fails)
        this.prisma.profile
          .update({
            where: { id: data.user.id },
            data: { last_login_at: new Date(iat * 1000) },
          })
          .catch(() => {});
      }
    }

    return {
      accessToken: session?.access_token,
      refreshToken: session?.refresh_token,
      expiresIn: session?.expires_in,
      user: data.user,
    };
  }

  async signOut(token: string) {
    // Decode user id from token to clear last_login_at
    try {
      const payload = this.decodeJwtPayload(token);
      if (payload?.sub) {
        await this.prisma.profile
          .update({ where: { id: payload.sub }, data: { last_login_at: null } })
          .catch(() => {});
      }
    } catch { /* ignore */ }
    await this.supabase.auth.admin.signOut(token);
    return { message: 'Signed out successfully' };
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) throw new UnauthorizedException('Invalid refresh token');

    // Update last_login_at for the refreshed session too
    const session = data.session;
    if (session?.access_token && data.user?.id) {
      const iat = this.decodeJwtIat(session.access_token);
      if (iat) {
        this.prisma.profile
          .update({
            where: { id: data.user.id },
            data: { last_login_at: new Date(iat * 1000) },
          })
          .catch(() => {});
      }
    }

    return {
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      expiresIn: data.session?.expires_in,
    };
  }

  async forgotPassword(email: string) {
    // Rate-limit: prevent abuse by limiting reset emails per address
    const last = AuthService.resetRequestTimestamps.get(email);
    const now = Date.now();
    if (last && now - last < AuthService.RESET_RATE_LIMIT_MS) {
      throw new HttpException('Please wait before requesting another password reset', HttpStatus.TOO_MANY_REQUESTS);
    }

    // record request (best-effort in-memory)
    AuthService.resetRequestTimestamps.set(email, now);
    // auto-cleanup after window
    setTimeout(() => AuthService.resetRequestTimestamps.delete(email), AuthService.RESET_RATE_LIMIT_MS + 1000);

    try {
      // Use Supabase client to send a password reset email.
      const frontend = this.config.get<string>('app.frontendUrl') || undefined;
      const redirectTo = frontend ? `${frontend.replace(/\/$/, '')}/reset-password` : undefined;

      // @ts-ignore - call supabase resetPasswordForEmail when available
      const result = (this.supabase.auth as any).resetPasswordForEmail
        ? await (this.supabase.auth as any).resetPasswordForEmail(email, { redirectTo })
        : await (this.supabase.auth as any).resetPasswordForEmail(email);

      const error = result?.error;
      if (error) {
        // Map Supabase rate-limit to 429
        const status = error?.status || error?.statusCode || error?.code;
        if (status === 429 || status === '429') {
          throw new HttpException('Email provider rate limit exceeded, try again later', HttpStatus.TOO_MANY_REQUESTS);
        }
        throw new BadRequestException(error.message || 'Unable to send password reset email');
      }

      return { message: 'Password reset email sent' };
    } catch (err) {
      // If we threw TooManyRequestsException above, rethrow
      if (err instanceof HttpException && err.getStatus() === HttpStatus.TOO_MANY_REQUESTS) throw err;
      if (err instanceof BadRequestException) throw err;
      // Generic fallback
      throw new BadRequestException('Unable to send password reset email');
    }
  }

  private decodeJwtIat(token: string): number | null {
    const payload = this.decodeJwtPayload(token);
    return typeof payload?.iat === 'number' ? payload.iat : null;
  }

  private decodeJwtPayload(token: string): Record<string, any> | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const decoded = Buffer.from(parts[1], 'base64url').toString('utf-8');
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}
