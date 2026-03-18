import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    private async generateTokens(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get<string>('JWT_SECRET'),
            expiresIn: 900, // 15 minutes in seconds
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET', this.config.get<string>('JWT_SECRET', 'fallback') + '_refresh'),
            expiresIn: 604800, // 7 days in seconds
        });

        // Hash refresh token before storing
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefresh },
        } as any);

        return { accessToken, refreshToken };
    }

    async register(email: string, username: string, password: string) {
        if (!password || password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters');
        }

        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if (existing) {
            if ((existing as any).email === email) throw new ConflictException('Email already exists');
            throw new ConflictException('Username already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { email, username, password: hashedPassword } as any,
        });

        const tokens = await this.generateTokens(user.id, user.email, (user as any).role ?? 'USER');
        return {
            user: { id: user.id, email: user.email, username: user.username, role: (user as any).role },
            ...tokens,
        };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } }) as any;
        if (!user) throw new UnauthorizedException('Invalid credentials');
        if (!user.password) throw new UnauthorizedException('Account uses a different login method');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        const tokens = await this.generateTokens(user.id, user.email, user.role ?? 'USER');
        return {
            user: { id: user.id, email: user.email, username: user.username, role: user.role },
            ...tokens,
        };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } }) as any;
        if (!user?.refreshToken) throw new UnauthorizedException('Access denied');

        const valid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!valid) throw new UnauthorizedException('Invalid refresh token');

        const tokens = await this.generateTokens(user.id, user.email, user.role ?? 'USER');
        return tokens;
    }

    async logout(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null } as any,
        });
        return { message: 'Logged out successfully' };
    }
}
