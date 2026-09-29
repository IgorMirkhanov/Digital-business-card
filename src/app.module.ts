import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { envValidationSchema } from './config/env.validation';
import { graphqlConfigFactory } from './graphql/graphql.config';
import { HealthController } from './health/health.controller';
import { ExperienceModule } from './modules/experience/experience.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SkillsModule } from './modules/skills/skills.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validationSchema: envValidationSchema }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: graphqlConfigFactory,
    }),
    PrismaModule,
    SkillsModule,
    ExperienceModule,
    ProjectsModule,
    ProfileModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
