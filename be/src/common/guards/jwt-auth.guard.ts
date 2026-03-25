import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];

    const supabase = createClient(
      this.configService.get<string>('supabase.url')!,
      this.configService.get<string>('supabase.serviceRoleKey')!,
    );

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Attach DB role from profiles table (authoritative source of truth)
    const profile = await this.prisma.profile.findUnique({
      where: { id: data.user.id },
      select: { role: true, last_login_at: true, is_active: true },
    });

    if (profile?.is_active === false) {
      throw new UnauthorizedException('Your account has been disabled');
    }

    // Single-session enforcement: compare JWT iat with stored last_login_at.
    // If another login has occurred since this token was issued, reject it.
    if (profile?.last_login_at) {
      const tokenIat = this.decodeJwtIat(token);
      if (tokenIat !== null) {
        const tokenIatMs = tokenIat * 1000;
        const storedLoginMs = profile.last_login_at.getTime();
        // Allow 30-second tolerance for clock drift between Supabase and DB
        if (tokenIatMs < storedLoginMs - 30_000) {
          throw new UnauthorizedException(
            'Session has been invalidated. Please log in again.',
          );
        }
      }
    }

    request.user = data.user;
    request.user.dbRole = profile?.role ?? 'user';

    return true;
  }

  private decodeJwtIat(token: string): number | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const decoded = Buffer.from(parts[1], 'base64url').toString('utf-8');
      const payload = JSON.parse(decoded);
      return typeof payload.iat === 'number' ? payload.iat : null;
    } catch {
      return null;
    }
  }
}
