# AGENTS.md

Инструкции для AI-агентов (Cursor, Claude Code и др.), работающих в этом репозитории.

- Архитектура и принятые решения: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- План работ с готовыми задачами: [`docs/ROADMAP.md`](docs/ROADMAP.md)
- Правила для Cursor: [`.cursor/rules/`](.cursor/rules)

## Команды

```bash
npm ci                     # зависимости
npx prisma generate        # Prisma Client (после изменений schema.prisma)
npm run lint               # tsc --noEmit — обязателен перед коммитом
npm test                   # unit-тесты
npm run db:deploy          # миграции + сид (нужен DATABASE_URL)
npm run test:e2e           # e2e на реальной БД (после db:deploy)
npm run start:dev          # dev-сервер, http://localhost:3000/graphql
docker compose up --build  # полный стек с нуля
```

Локальная БД для разработки: `docker compose up -d db` не публикует порт наружу — для `npm run start:dev`
используйте свой PostgreSQL или временно добавьте `ports: ["5432:5432"]` сервису `db`.

## Definition of Done для любой задачи

1. `npm run lint`, `npm test`, `npm run test:e2e` — зелёные.
2. Если менялась схема GraphQL — `schema.gql` перегенерирован (`npm run start:dev` или `npm run build && node dist/main.js`) и закоммичен.
3. Если менялась `schema.prisma` — создана миграция `npm run db:migrate -- --name <name>`, закоммичена.
4. `docker compose down -v && docker compose up --build` поднимается с нуля, запрос `profile` отвечает.
5. README/ARCHITECTURE обновлены, если поменялось поведение или структура.
