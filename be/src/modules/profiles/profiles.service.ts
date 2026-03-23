import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(id: string, data: { displayName?: string; avatarUrl?: string; bio?: string }) {
    return this.prisma.profile.update({ where: { id }, data });
  }

  async getWalletBalance(id: string) {
    const profile = await this.findById(id);
    return { walletBalance: profile.walletBalance };
  }
}
