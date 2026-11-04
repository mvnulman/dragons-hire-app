# Dragons Hire — API

NestJS 12 + Prisma 7 + PostgreSQL. Responsável pelo domínio (dragões, missões, reservas),
autenticação (Better Auth) e pelo motor de matching.

## Rodando

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

- API: <http://localhost:3001>
- Swagger: <http://localhost:3001/docs>
- OpenAPI JSON: <http://localhost:3001/docs-json>
- Health: <http://localhost:3001/health>

## Módulos

| Módulo | Responsabilidade |
| --- | --- |
| `prisma/` | `PrismaService` (driver adapter `pg`) e conexão única compartilhada |
| `auth/` | Instância do Better Auth montada em `/api/auth/*`, roles em `user.role` |
| `dragons/` | Catálogo público com filtros, ordenação e paginação |
| `health/` | Liveness + checagem real do banco |

## Endpoints

| Método | Rota | Auth |
| --- | --- | --- |
| `GET` | `/` | público |
| `GET` | `/health` | público |
| `GET` | `/dragons` | público |
| `GET` | `/dragons/:id` | público |
| `POST` | `/api/auth/sign-up/email` | público |
| `POST` | `/api/auth/sign-in/email` | público |

Filtros de `/dragons`: `locale`, `species`, `temperament`, `riskLevel`, `minLoadKg`,
`maxHourlyRate`, `city`, `availability`, `sort`, `page`, `pageSize`.

## Schema

`prisma/schema.prisma` cobre:

- **Auth**: `User` (com `role`), `Session`, `Account`, `Verification`
- **Domínio**: `DragonSpecies` (bilíngue), `Dragon`, `DragonUnavailability`, `Mission`,
  `Booking`, `Review`

O motor de matching e a proteção contra double-booking entram na Fase 2/3.

## Testes

```bash
npm test          # unitários, sem banco
npm run test:e2e  # exige DATABASE_URL com schema migrado
```
