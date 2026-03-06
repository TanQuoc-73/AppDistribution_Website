import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(email: string, username: string) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) throw new ConflictException('Email already exists');

        const user = await this.prisma.user.create({
            data: { email, username },
        });

        const token = this.jwtService.sign({ sub: user.id, email: user.email });
        return { user: { id: user.id, email: user.email, username: user.username }, token };
    }

    async login(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException('User not found');

        const token = this.jwtService.sign({ sub: user.id, email: user.email });
        return { user: { id: user.id, email: user.email, username: user.username }, token };
    }
}
