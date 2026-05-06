# Estudos e Oracoes (Quasar + Vue 3)

SPA feita com Vue 3 (Composition API), Quasar e Vite, com:
- Home animada, menu, lista dinamica e admin/upload
- Integracao preparada para Supabase (Database + Storage)
- PWA habilitado via `vite-plugin-pwa`
- CI e deploy automatico no GitHub Actions

## Rodar localmente

```bash
npm ci
npm run dev
```

## Build de producao

```bash
npm run build
npm run preview
```

## Supabase

1. Copie `.env.example` para `.env`
2. Preencha:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_BUCKET` (opcional, padrao: `pdfs`)

Tabela esperada no banco (`conteudos`):
- `id` (uuid ou bigint)
- `titulo` (text)
- `legenda` (text)
- `data` (text)
- `tipo` (text: `estudos` ou `cartas`)
- `url` (text)
- `created_at` (timestamp, default `now()`)

Com variaveis ausentes, o app cai automaticamente para mock local.

### SQL pronto

Use o arquivo `supabase/setup.sql` no SQL Editor do Supabase.
Ele cria:
- tabela `conteudos`
- tabela `admin_users`
- bucket `pdfs`
- politicas RLS de leitura/upload

Credencial administrativa solicitada:
- usuario: `adm`
- senha: `admin`

No app, a tela `/admin` pede esse login antes do upload.

## Publicacao web (GitHub Pages)

Workflow: `.github/workflows/deploy-pages.yml`.

Depois do push na `main`, configure no GitHub:
- Repository Settings -> Pages -> Source: `GitHub Actions`

URL esperada:
- `https://utahh.github.io/anotacoes/`

## CI

Workflow: `.github/workflows/ci-cd.yml`
- instala dependencias
- roda lint
- roda build
