# Digital Business Card API

Цифровая визитка в виде backend-приложения: GraphQL API (Apollo Sandbox), через которое можно получить
профиль, навыки, опыт работы и проекты.

**Стек:** TypeScript · Node.js 22 · NestJS 11 · GraphQL (Apollo Server 5, code-first) · Prisma 6 · PostgreSQL 16 · Docker

## Быстрый старт

```bash
git clone https://github.com/IgorMirkhanov/Digital-business-card.git
cd Digital-business-card
docker compose up --build
```

Откройте **http://localhost:3000/graphql** — загрузится Apollo Sandbox с готовым запросом.
При старте контейнер сам применяет миграции и заполняет базу (`docker-entrypoint.sh`), дополнительных шагов нет.

### Без Docker

```bash
cp .env.example .env        # указать DATABASE_URL на свой PostgreSQL
npm ci
npm run db:deploy           # prisma migrate deploy + seed
npm run start:dev
```

## Пример запроса

```graphql
query {
  profile {
    name
    headline
    description
    links { kind label url }
    skills { name category }
    skillGroups { category skills { name } }
    experience {
      company
      position
      period { label isCurrent durationMonths }
      achievements
    }
    projects {
      name
      url
      repositoryUrl
      technologies { name }
    }
  }
}
```

Дополнительно: `profile(slug: "...")`, `profiles`, фильтр `skills(category: BACKEND)`.
Полная схема — в [`schema.gql`](./schema.gql) (генерируется из кода).

## Архитектура

```text
src/
  main.ts, app.module.ts
  config/                 валидация переменных окружения (Joi)
  prisma/                 PrismaService (глобальный модуль)
  graphql/                конфигурация Apollo, контекст запроса, DataLoader-инфраструктура
  health/                 GET /health (проверка соединения с БД) для Docker/хостинга
  modules/
    profile/              Query profile/profiles + поля профиля
    skills/               навыки, группировка по категориям
    experience/           опыт, достижения, вычисление периода работы
    projects/             проекты и их технологии
prisma/
  schema.prisma           модель данных
  migrations/             SQL-миграции (в репозитории)
  data/profile.data.ts    содержимое визитки — единственное место для правки данных
  seed.ts                 идемпотентное заполнение БД
```

Каждый модуль разделён на три слоя:

| Слой | Ответственность |
|------|-----------------|
| `*.repository.ts` | Только доступ к данным через Prisma: запросы, сортировка, батч-выборки по списку id |
| `*.service.ts` | Бизнес-логика: выбор профиля по умолчанию, фильтрация и группировка навыков, расчёт периода работы, ошибки домена |
| `*.resolver.ts` | Тонкий GraphQL-слой: связывает схему с сервисами, без логики и без Prisma |

GraphQL-модели (`models/*.model.ts`) описывают публичный контракт и не совпадают один-в-один с таблицами:
например, `Experience.period` — вычисляемое поле, а `achievements` хранятся в отдельной таблице.

### Вложенные данные и N+1

Связанные коллекции (`links`, `skills`, `experience`, `achievements`, `projects`, `technologies`) резолвятся через
`@ResolveField` только если их запросили. Загрузка идёт через DataLoader: на каждый GraphQL-запрос создаётся свой
`LoaderRegistry` (без утечки кэша между запросами), а каждый сервис лениво регистрирует в нём свой загрузчик.
В итоге любое поле-коллекция — это один SQL-запрос `WHERE parent_id IN (...)` на весь запрос, независимо от числа
родительских объектов (например, при `profiles { projects { technologies } }`).

### База данных

- PostgreSQL, схема и миграции под управлением Prisma; все дочерние сущности удаляются каскадно вместе с профилем.
- Навыки и проекты связаны many-to-many (`Project.technologies`), поэтому технологии проекта — это ссылки на навыки,
  а не дублирующиеся строки. Сид проверяет, что проекты ссылаются только на существующие навыки.
- `endDate = null` означает текущее место работы; сортировка — сначала текущие, затем по дате начала.

### Инициализация

`docker-entrypoint.sh` при каждом запуске выполняет `prisma migrate deploy` и сид. Сид идемпотентен: профиль
upsert-ится по `slug`, дочерние коллекции пересоздаются в одной транзакции. Поэтому перезапуск безопасен,
а изменения в `prisma/data/profile.data.ts` применяются простым редеплоем.

### Ошибки

HTTP-исключения Nest из сервисов переводятся в GraphQL-коды (`NOT_FOUND`, `BAD_REQUEST`), stacktrace в
production не отдаётся.

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run start:dev` | Запуск в watch-режиме |
| `npm run build` | Сборка в `dist/` |
| `npm run db:migrate` | Создать миграцию после изменения `schema.prisma` |
| `npm run db:deploy` | Применить миграции и заполнить БД |
| `npm run lint` | Проверка типов |
| `npm test` | Unit-тесты (DataLoader, период работы, группировка навыков) |
| `npm run test:e2e` | E2E-тесты API на реальной БД |

CI (GitHub Actions) прогоняет проверку типов, unit- и e2e-тесты на PostgreSQL, а также поднимает
`docker compose` с нуля и выполняет запрос к API.

## Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `DATABASE_URL` | — | Строка подключения PostgreSQL |
| `PORT` | `3000` | Порт HTTP-сервера |
| `GRAPHQL_SANDBOX` | `true` | Apollo Sandbox и introspection |
| `DEFAULT_PROFILE_SLUG` | `igor-mirkhanov` | Профиль, возвращаемый `profile` без аргументов |

## Деплой на Render

В репозитории есть Blueprint [`render.yaml`](./render.yaml): **New → Blueprint → выбрать репозиторий**.
Render создаст PostgreSQL и Docker-сервис; миграции и сид выполнятся при старте контейнера.
Sandbox будет доступен по адресу `https://<service>.onrender.com/graphql`.
