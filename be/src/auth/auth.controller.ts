import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, CurrentUser } from './guards.js';
import { AuthService } from './auth.service.js';
import { RegisterDto, LoginDto, RefreshDto } from './dto/auth.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user with email + password' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.email, dto.username, dto.password);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email + password' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    refresh(@Body() dto: RefreshDto) {
        return this.authService.refreshTokens(dto.userId, dto.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout (invalidate refresh token)' })
    logout(@CurrentUser() user: { id: string }) {
        return this.authService.logout(user.id);
    }
}
