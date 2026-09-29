import { PrismaClient } from '@prisma/client';
import { profileSeed, ProfileSeed } from './data/profile.data';

/**
 * Idempotent seed: the profile is upserted by slug and all of its child
 * collections are replaced in one transaction. Running it on every container
 * start is safe and keeps the database in sync with `profile.data.ts`.
 */
async function seedProfile(prisma: PrismaClient, data: ProfileSeed): Promise<void> {
  const unknownTechnologies = data.projects
    .flatMap((project) => project.technologies)
    .filter((name) => !data.skills.some((skill) => skill.name === name));
  if (unknownTechnologies.length > 0) {
    throw new Error(`Projects reference unknown skills: ${[...new Set(unknownTechnologies)].join(', ')}`);
  }

  await prisma.$transaction(async (tx) => {
    const scalars = {
      name: data.name,
      headline: data.headline,
      description: data.description,
      location: data.location ?? null,
    };
    const profile = await tx.profile.upsert({
      where: { slug: data.slug },
      create: { slug: data.slug, ...scalars },
      update: scalars,
    });
    const profileId = profile.id;

    // Children cascade: achievements go with experience, project<->skill links with either side.
    await Promise.all([
      tx.link.deleteMany({ where: { profileId } }),
      tx.experience.deleteMany({ where: { profileId } }),
      tx.project.deleteMany({ where: { profileId } }),
      tx.skill.deleteMany({ where: { profileId } }),
    ]);

    await tx.link.createMany({
      data: data.links.map((link, position) => ({ ...link, profileId, position })),
    });
    await tx.skill.createMany({
      data: data.skills.map((skill, position) => ({ ...skill, profileId, position })),
    });

    for (const job of data.experience) {
      await tx.experience.create({
        data: {
          profileId,
          company: job.company,
          position: job.position,
          location: job.location ?? null,
          startDate: new Date(job.startDate),
          endDate: job.endDate ? new Date(job.endDate) : null,
          achievements: {
            create: job.achievements.map((text, index) => ({ text, position: index })),
          },
        },
      });
    }

    for (const [position, project] of data.projects.entries()) {
      await tx.project.create({
        data: {
          profileId,
          position,
          name: project.name,
          description: project.description,
          url: project.url ?? null,
          repositoryUrl: project.repositoryUrl ?? null,
          technologies: {
            connect: project.technologies.map((name) => ({ profileId_name: { profileId, name } })),
          },
        },
      });
    }
  });
}

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    await seedProfile(prisma, profileSeed);
    console.log(`Seeded profile "${profileSeed.slug}"`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
