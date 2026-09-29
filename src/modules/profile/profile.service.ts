import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Link, Profile } from '@prisma/client';
import { EnvironmentVariables } from '../../config/env.validation';
import { createOneToManyLoader, LoaderRegistry } from '../../graphql/loaders/loader-registry';
import { ProfileRepository } from './profile.repository';

const LINKS_BY_PROFILE = Symbol('linksByProfile');

@Injectable()
export class ProfileService {
  constructor(
    private readonly repository: ProfileRepository,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  /** Returns the requested profile, or the owner's one when no slug is given. */
  async getBySlug(slug?: string): Promise<Profile> {
    const effectiveSlug = slug ?? this.config.getOrThrow('DEFAULT_PROFILE_SLUG', { infer: true });
    const profile = await this.repository.findBySlug(effectiveSlug);
    if (!profile) {
      throw new NotFoundException(`Profile "${effectiveSlug}" not found`);
    }
    return profile;
  }

  findAll(): Promise<Profile[]> {
    return this.repository.findAll();
  }

  findLinks(loaders: LoaderRegistry, profileId: string): Promise<Link[]> {
    return loaders
      .get(LINKS_BY_PROFILE, () =>
        createOneToManyLoader(
          (ids) => this.repository.findLinksByProfileIds(ids),
          (link) => link.profileId,
        ),
      )
      .load(profileId);
  }
}
