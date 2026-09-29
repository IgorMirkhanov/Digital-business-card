import { Injectable } from '@nestjs/common';
import { Link, Profile } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { slug } });
  }

  findAll(): Promise<Profile[]> {
    return this.prisma.profile.findMany({ orderBy: { createdAt: 'asc' } });
  }

  findLinksByProfileIds(profileIds: readonly string[]): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }
}
