import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

/** Requires a migrated and seeded database (DATABASE_URL), e.g. `npm run db:deploy`. */
describe('Business card GraphQL API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const gql = (query: string) => request(app.getHttpServer()).post('/graphql').send({ query });

  it('returns the profile with nested collections', async () => {
    const response = await gql(`{
      profile {
        name
        description
        links { url }
        skills { name }
        experience { company position period { isCurrent } achievements }
        projects { name repositoryUrl technologies { name } }
      }
    }`).expect(200);

    expect(response.body.errors).toBeUndefined();
    const { profile } = response.body.data;
    expect(profile.name).toBeTruthy();
    expect(profile.links.length).toBeGreaterThan(0);
    expect(profile.skills.length).toBeGreaterThan(0);
    expect(profile.experience[0].achievements.length).toBeGreaterThan(0);
    expect(profile.projects[0].technologies.length).toBeGreaterThan(0);
  });

  it('reports an unknown profile as NOT_FOUND', async () => {
    const response = await gql('{ profile(slug: "unknown") { name } }').expect(200);

    expect(response.body.errors[0].extensions.code).toBe('NOT_FOUND');
  });

  it('exposes a health endpoint', async () => {
    await request(app.getHttpServer()).get('/health').expect(200, { status: 'ok' });
  });
});
