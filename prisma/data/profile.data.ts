import { LinkKind, SkillCategory } from '@prisma/client';

/**
 * Content of the business card. This is the single place to edit personal data:
 * the seed script turns it into database rows on every start (idempotently).
 */
export interface ProfileSeed {
  slug: string;
  name: string;
  headline: string;
  description: string;
  location?: string;
  links: { kind: LinkKind; label: string; url: string }[];
  skills: { name: string; category: SkillCategory }[];
  experience: {
    company: string;
    position: string;
    location?: string;
    /** ISO date, e.g. "2026-03-01" */
    startDate: string;
    /** ISO date or null for the current job */
    endDate: string | null;
    achievements: string[];
  }[];
  projects: {
    name: string;
    description: string;
    url?: string;
    repositoryUrl?: string;
    /** Names of skills from the `skills` list above */
    technologies: string[];
  }[];
}

export const profileSeed: ProfileSeed = {
  slug: 'igor-mirkhanov',
  name: 'Igor Mirkhanov',
  headline: 'Backend Developer · Node.js / TypeScript',
  description:
    'Backend-разработчик на Node.js и TypeScript. Проектирую API, интеграции ' +
    'с внешними сервисами и асинхронную обработку через очереди, встраиваю ' +
    'LLM в бизнес-процессы. Ценю строгую типизацию, понятную архитектуру ' +
    'и воспроизводимое окружение.',
  links: [
    { kind: LinkKind.GITHUB, label: 'GitHub', url: 'https://github.com/IgorMirkhanov' },
  ],
  skills: [
    { name: 'TypeScript', category: SkillCategory.LANGUAGE },
    { name: 'JavaScript', category: SkillCategory.LANGUAGE },
    { name: 'SQL', category: SkillCategory.LANGUAGE },
    { name: 'Node.js', category: SkillCategory.BACKEND },
    { name: 'NestJS', category: SkillCategory.BACKEND },
    { name: 'Express', category: SkillCategory.BACKEND },
    { name: 'GraphQL', category: SkillCategory.BACKEND },
    { name: 'REST API', category: SkillCategory.BACKEND },
    { name: 'BullMQ', category: SkillCategory.BACKEND },
    { name: 'Zod', category: SkillCategory.BACKEND },
    { name: 'PostgreSQL', category: SkillCategory.DATABASE },
    { name: 'Prisma', category: SkillCategory.DATABASE },
    { name: 'Supabase', category: SkillCategory.DATABASE },
    { name: 'Redis', category: SkillCategory.DATABASE },
    { name: 'Docker', category: SkillCategory.DEVOPS },
    { name: 'Git', category: SkillCategory.DEVOPS },
    { name: 'LLM integration (OpenAI SDK, DeepSeek)', category: SkillCategory.AI },
    { name: 'WhatsApp Cloud API', category: SkillCategory.TOOLING },
  ],
  experience: [
    {
      company: 'T3 MediaPeace',
      position: 'Backend Developer (Node.js / TypeScript)',
      startDate: '2026-03-01',
      endDate: null,
      achievements: [
        'Спроектировал и реализовал WhatsApp-бота для квалификации лидов на базе стейт-машины воронки.',
        'Внедрил ACK-only webhook для Meta WhatsApp Cloud API: мгновенный ответ и асинхронная обработка без дублей.',
        'Интегрировал DeepSeek (OpenAI SDK) со строгим JSON-ответом для распознавания намерений клиента.',
        'Построил цепочку напоминаний на BullMQ + Upstash Redis и CRM-хранилище лидов в Supabase.',
      ],
    },
  ],
  projects: [
    {
      name: 'WhatsApp AI Lead Qualification Bot',
      description:
        'Бот для автоматической квалификации лидов в WhatsApp: стейт-машина диалога, ' +
        'AI-анализ ответов, CRM в Supabase и отложенные напоминания через BullMQ.',
      repositoryUrl: 'https://github.com/IgorMirkhanov/WhatsApp-AI-Bot',
      technologies: [
        'TypeScript',
        'Node.js',
        'Express',
        'BullMQ',
        'Redis',
        'Supabase',
        'Zod',
        'LLM integration (OpenAI SDK, DeepSeek)',
        'WhatsApp Cloud API',
      ],
    },
    {
      name: 'Digital Business Card API',
      description:
        'Эта визитка: GraphQL API на NestJS + Prisma + PostgreSQL с автоматической ' +
        'миграцией и наполнением БД при старте, упакованное в Docker.',
      repositoryUrl: 'https://github.com/IgorMirkhanov/Digital-business-card',
      technologies: ['TypeScript', 'Node.js', 'NestJS', 'GraphQL', 'Prisma', 'PostgreSQL', 'Docker'],
    },
  ],
};
