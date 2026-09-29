import { Skill, SkillCategory } from '@prisma/client';
import { SkillsService } from './skills.service';

const skill = (name: string, category: SkillCategory): Skill => ({
  id: name,
  profileId: 'p',
  name,
  category,
  position: 0,
});

describe('SkillsService.group', () => {
  it('groups by category in enum order and drops empty groups', () => {
    const groups = SkillsService.group([
      skill('Docker', SkillCategory.DEVOPS),
      skill('TypeScript', SkillCategory.LANGUAGE),
      skill('Git', SkillCategory.DEVOPS),
    ]);

    expect(groups.map((group) => group.category)).toEqual([SkillCategory.LANGUAGE, SkillCategory.DEVOPS]);
    expect(groups[1].skills.map((s) => s.name)).toEqual(['Docker', 'Git']);
  });
});
