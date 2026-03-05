import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LibraryService {
    constructor(private prisma: PrismaService) { }

    async getUserLibrary(userId: number) {
        const entries = await this.prisma.userLibrary.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        versions: {
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return entries.map((entry) => ({
            id: entry.id,
            product: entry.product,
            latestVersion: entry.product.versions[0] ?? null,
            downloadUrl: entry.product.versions[0]?.downloadUrl ?? null,
            addedAt: entry.createdAt,
        }));
    }
}
