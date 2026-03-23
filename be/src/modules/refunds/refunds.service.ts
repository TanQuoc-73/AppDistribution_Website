import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RefundsService {
  constructor(private readonly prisma: PrismaService) {}
}
