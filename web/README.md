# Dragons Hire — Web

Next.js 16 (App Router) + React 19 + Tailwind 4 + shadcn/ui + next-intl.

## Rodando

```bash
cp .env.example .env.local
npm install
npm run dev     # http://localhost:3000
```

A API precisa estar em `http://localhost:3001` (ou ajuste `API_ORIGIN`).

## Estrutura

```
src/app/[locale]/     rotas (pt sem prefixo, en em /en)
src/components/       shell, cards e componentes shadcn em components/ui
src/i18n/             routing, request config e navegação tipada
src/lib/api/          client HTTP e tipos do contrato
messages/             traduções pt.json e en.json
public/dragons/       iluminuras medievais da frota
public/art/           arte de fundo do hero
```

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run openapi` | Regenera `src/lib/api/schema.d.ts` a partir de `localhost:3001/docs-json` |
| `npm run art:fetch` | Resolve a arte pela API do Wikimedia Commons, valida licença, recorta, comprime e atualiza `src/content/art-credits.json` |

## Proxy

`next.config.ts` reescreve `/api/auth/*` e `/api/*` para a API Nest. O browser nunca fala com
outra origem, então o cookie de sessão do Better Auth permanece same-origin — inclusive em
produção, onde web e API ficam em domínios diferentes.
