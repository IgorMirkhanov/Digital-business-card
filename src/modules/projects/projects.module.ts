import { Module } from '@nestjs/common';
import { SkillsModule } from '../skills/skills.module';
import { ProjectsRepository } from './projects.repository';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

@Module({
  imports: [SkillsModule],
  providers: [ProjectsRepository, ProjectsService, ProjectsResolver],
  exports: [ProjectsService],
})
export class ProjectsModule {}
