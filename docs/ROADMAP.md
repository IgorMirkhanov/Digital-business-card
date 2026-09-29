# Roadmap

Задачи в порядке приоритета. Каждая — самодостаточный промпт для Cursor: скопируй блок «Промпт» в чат агента.
Общие правила — `AGENTS.md` и `.cursor/rules/`. После задачи отметь её `[x]`.

---

## [ ] T1. Заполнить реальные данные визитки — ⚠️ блокер перед сдачей

**Сейчас:** один опыт работы (T3 MediaPeace, с 2026-03 — дата предположительная), только ссылка на GitHub, без `location`.

**Промпт:**
> Обнови `prisma/data/profile.data.ts` моими данными: [вставь сюда — ФИО, заголовок, описание 2–3 предложения,
> город, ссылки (GitHub, LinkedIn, Telegram, email — что хочешь показывать публично), все места работы
> с датами и 2–4 достижениями каждое (глагол + результат, по возможности с цифрами), проекты со ссылками].
> Ничего не выдумывай. Технологии проектов должны быть в `skills`. Затем `npm run db:seed` дважды,
> `npm run test:e2e`, закоммить `feat(data): ...`.

**Критерии:** сид проходит, в Sandbox всё отображается, нет вымышленных фактов.

---

## [ ] T2. Задеплоить на Render и получить публичную ссылку — ⚠️ блокер перед сдачей

Делается руками в UI (агент не имеет доступа к Render):

1. Смёржить ветку в `main` (или выбрать ветку при создании Blueprint).
2. https://dashboard.render.com → **New → Blueprint** → репозиторий `Digital-business-card` → Apply.
3. Дождаться деплоя, открыть `https://<service>.onrender.com/graphql`, выполнить запрос из README.
4. Вставить ссылку в README (раздел «Демо» в начале).

**Если деплой падает** — скопируй логи в Cursor:
> Деплой на Render падает, логи ниже. Найди причину, исправь минимально, проверь `docker compose down -v && docker compose up --build`.

Нюансы: free-сервис засыпает (первый запрос ~50 с), free Postgres живёт 30 дней. Альтернатива — Railway
(New Project → Deploy from GitHub → Add PostgreSQL → переменная `DATABASE_URL=${{Postgres.DATABASE_URL}}`).

---

## [ ] T3. Проверить CI на GitHub

**Промпт:**
> Открой последний прогон GitHub Actions (workflow CI). Если какой-то job красный — найди первопричину по логам и исправь.
> Не отключай и не пропускай тесты.

---

## [ ] T4. Линтер и форматирование (ESLint + Prettier)

**Промпт:**
> Добавь ESLint (flat config, `typescript-eslint` recommended-type-checked) и Prettier
> (singleQuote, trailingComma all, printWidth 110 — подбери под текущий код, чтобы diff был минимальным).
> Скрипты `lint` (eslint + tsc --noEmit) и `format`. Прогони на всём проекте, исправь замечания без изменения поведения.
> Добавь шаг в CI. Обнови таблицу скриптов в README.

---

## [ ] T5. Переходы между сущностями: `Skill.projects`

Показывает работу графа в обе стороны: «в каких проектах применял навык».

**Промпт:**
> Добавь поле `projects: [Project!]!` в GraphQL-тип `Skill` по правилам `.cursor/rules/architecture.mdc`:
> батч-метод в `ProjectsRepository.findBySkillIds`, loader в `ProjectsService`, `SkillsResolver` с `@ResolveField`.
> Избегай циклической зависимости модулей Skills ↔ Projects (вынеси резолвер поля в ProjectsModule —
> `@Resolver(() => Skill)` можно объявить там). Unit + e2e тесты, обнови `schema.gql`, README, ARCHITECTURE.

---

## [ ] T6. Тест, доказывающий отсутствие N+1

**Промпт:**
> Напиши e2e-тест: создай в тестовой БД 3 дополнительных профиля с опытом и проектами (и удали их в afterAll),
> выполни `profiles { skills { name } experience { achievements } projects { technologies { name } } }`
> и проверь, что число SQL-запросов не зависит от количества профилей (≤ 6). Для подсчёта добавь в
> `PrismaService` опциональное логирование запросов через event (`log: [{ emit: 'event', level: 'query' }]`),
> включаемое только в тестах.

---

## [ ] T7. Защита API: ограничение глубины и сложности запросов

**Промпт:**
> Добавь ограничение глубины GraphQL-запросов (например, `graphql-depth-limit`, лимит 6) в validationRules
> Apollo в `graphql.config.ts`. Лимит — через env `GRAPHQL_MAX_DEPTH` с валидацией Joi. e2e-тест на отказ
> слишком глубокого запроса.

---

## [ ] T8. Структурированные логи

**Промпт:**
> Подключи `nestjs-pino`: JSON-логи в production, pretty в dev, логирование GraphQL-операций (имя операции,
> длительность) через Apollo-плагин. Без логирования переменных запроса.

---

## [ ] T9. Мелкие улучшения (по желанию)

- `Profile.avatarUrl`, `Profile.email` (публичный), `Experience.stack: [Skill!]!` — по чек-листу «новая сущность/поле».
- Кэш-заголовки / `@cacheControl` для публичных данных.
- `Query.skills(category)` и `Query.project(id)` на верхнем уровне.
- Пагинация не нужна: данные визитки ограничены.

---

## Порядок перед сдачей

T1 → T2 → T3 → (T4) → финальная проверка: `docker compose down -v && docker compose up --build`,
ссылки в README: репозиторий + демо `/graphql`.
