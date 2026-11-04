# Dragons Hire

> Rent the right dragon for the right mission.

Marketplace de aluguel de dragões: você descreve a missão (carga, rota, risco, datas) e recebe
um ranking de dragões disponíveis com **score e justificativa**, não uma lista aleatória.

O reino negocia em **dracmas (₯)**. Os preços ficam como `Decimal` no banco e são formatados por
locale no cliente (`Intl.NumberFormat`), sem símbolo de moeda real.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui |
| i18n | next-intl (PT-BR padrão, EN com prefixo `/en`) |
| API | NestJS 12 · class-validator · Swagger |
| Banco | PostgreSQL 17 · Prisma 7 (driver adapter `pg`) |
| Auth | Better Auth (email/senha) + roles `CLIENT` / `KEEPER` / `ADMIN` |
| Testes | Vitest (unit + e2e) · oxlint |

## Estrutura

```
server/   API NestJS (domínio, auth, Prisma)
web/      Aplicação Next.js (catálogo, matching, reservas)
messages/ traduções pt/en (dentro de web/)
```

O browser fala apenas com o Next. Um rewrite em `web/next.config.ts` encaminha `/api/*` para a
API, então o cookie do Better Auth é sempre same-origin.

## Rodando localmente

### 1. Banco

```bash
docker compose up -d
```

Sem Docker? Aponte `DATABASE_URL` para um Postgres gerenciado (Neon, Supabase, Railway).

### 2. API

```bash
cd server
cp .env.example .env      # ajuste DATABASE_URL e BETTER_AUTH_SECRET
npm install
npm run db:migrate        # cria as tabelas
npm run db:seed           # 10 dragões + 3 linhagens
npm run start:dev         # http://localhost:3001
```

Swagger: <http://localhost:3001/docs> · Health: <http://localhost:3001/health>

### 3. Web

```bash
cd web
cp .env.example .env.local
npm install
npm run dev               # http://localhost:3000
```

## Scripts úteis

**server**

| Script | O que faz |
| --- | --- |
| `npm run start:dev` | API em watch mode |
| `npm run db:migrate` | Aplica migrations |
| `npm run db:seed` | Popula a frota |
| `npm run db:studio` | Prisma Studio |
| `npm test` | Testes unitários |
| `npm run test:e2e` | Testes e2e (exigem banco) |

**web**

| Script | O que faz |
| --- | --- |
| `npm run dev` | App em watch mode |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |

## Arte

Toda a arte da frota vem da **API pública do Wikimedia Commons**. O pipeline em
`web/scripts/fetch-art.mjs`:

1. resolve cada obra pelo título via `action=query&prop=imageinfo`;
2. **valida a licença** (só aceita domínio público/CC0, falha se não bater);
3. baixa a rendition de 1400px, recorta em 900×650 (hero em 1600×700) e comprime em JPEG;
4. grava os metadados de procedência em `web/src/content/art-credits.json`.

```bash
cd web && npm run art:fetch
```

As imagens ficam cacheadas em `public/` para não depender da API em runtime, e a procedência
aparece em **[/pt/credits](http://localhost:3000/pt/credits)** e `/en/credits`.

| Dragão | Obra | Origem |
| --- | --- | --- |
| Ignis | Bestiário de Aberdeen, f. 65v | [Commons](https://commons.wikimedia.org/wiki/File:AberdeenBestiaryFolio065vDragonDetail.jpg) |
| Cinder | Harley MS 3244 | [Commons](https://commons.wikimedia.org/wiki/File:Dragon_Harley_MS_3244.png) |
| Pyrrha | Sloane MS 278, f. 48v (Hugo de Fouilloy) | [Commons](https://commons.wikimedia.org/wiki/File:Sloane278_f.48v_Elephants,Dragon,AndMandrake.jpg) |
| Tempest | Bestiário de Hugo de Fouilloy, c. 1270 | [Commons](https://commons.wikimedia.org/wiki/File:A_dragon_ca._1270_Hugh_of_Fouilloy%27s_Bestiary.jpg) |
| Zephyr | Walters MS W659, f. 155B | [Commons](https://commons.wikimedia.org/wiki/File:Muhammad_ibn_Muhammad_Shakir_Ruzmah-%27i_Nathani_-_Dragon_of_Tannin_Island_and_Horned_Rabit_-_Walters_W659155B_-_Full_Page.jpg) |
| Nimbus | Ms. Ludwig XV 3, f. 89, c. 1270 | [Commons](https://commons.wikimedia.org/wiki/File:Ms._Ludwig_XV_3_(83.MR.173),_fol._89_A_Dragon,_about_1270.jpg) |
| Ferrum | Aurora Consurgens, Zurique, f. 21v | [Commons](https://commons.wikimedia.org/wiki/File:Aurora_consurgens_zurich_044_f-21v-44_dragon-pot.jpg) |
| Bastion | Aurora Consurgens, Zurique, f. 36r | [Commons](https://commons.wikimedia.org/wiki/File:Aurora_consurgens_zurich_073_f-36r-73_dragon-ground.jpg) |
| Talos | Aurora Consurgens, Zurique, f. 20v | [Commons](https://commons.wikimedia.org/wiki/File:Aurora_consurgens_zurich_042_f-20v-42_dragon-ring.jpg) |
| Vesper | Apocalipse de Queen Mary, BL Royal MS 19 B XV, f. 23 | [Commons](https://commons.wikimedia.org/wiki/File:Queen_Mary_Apocalypse_-_BL_Royal_MS_19_B_XV_f._23_Beast_and_dragon.jpg) |
| Hero | Harley MS 3244 | [Commons](https://commons.wikimedia.org/wiki/File:Dragon_3244.jpg) |

## Tipagem ponta a ponta

Os DTOs da API são documentados no Swagger. Com a API rodando:

```bash
cd web
npm run openapi   # gera src/lib/api/schema.d.ts a partir de /docs-json
```

Na Fase 2 o cliente `openapi-fetch` passa a consumir esse schema em vez dos tipos manuais de
`src/lib/api/types.ts`.

## Estado do roadmap

- [x] **Fase 0** — fundação: Prisma + Better Auth + env validado + seed + Swagger + Next/i18n/tema + arte medieval da frota
- [ ] **Fase 1** — catálogo com filtros e ficha do dragão
- [ ] **Fase 2** — motor de matching (`POST /missions/:id/match`)
- [ ] **Fase 3** — reserva com hold de 15 min e proteção contra double-booking
- [ ] **Fase 4** — painel do keeper, reviews, deploy
