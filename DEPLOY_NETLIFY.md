# 📋 GUIA DE DEPLOY — NATIVOS3D ACADEMY NO NETLIFY

**Última atualização:** 30/09/2026  
**Projeto:** Monorepo pnpm + Vite + React + Netlify Functions + Supabase

---

## 📁 ESTRUTURA DO PROJETO

```
modeladoracademi/
├── package.json              # Workspace raiz (pnpm)
├── pnpm-workspace.yaml       # Configuração do monorepo
├── pnpm-lock.yaml            # Lockfile (NÃO versionar node_modules)
├── netlify.toml              # Configuração do Netlify
├── .npmrc                    # Configuração do npm/pnpm
├── .gitignore
│
├── artifacts/
│   ├── nativos-academy/      # 🎯 FRONTEND (app principal)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── index.css
│   │   │   ├── components/
│   │   │   │   ├── academy-ui.tsx
│   │   │   │   ├── admin-ui.tsx
│   │   │   │   ├── error-boundary.tsx
│   │   │   │   └── ui/
│   │   │   ├── pages/
│   │   │   │   ├── academy-pages.tsx
│   │   │   │   └── admin/
│   │   │   │       ├── dashboard.tsx
│   │   │   │       ├── courses.tsx
│   │   │   │       ├── course-builder.tsx
│   │   │   │       ├── media.tsx
│   │   │   │       ├── students.tsx
│   │   │   │       ├── quizzes.tsx
│   │   │   │       ├── analytics.tsx
│   │   │   │       ├── settings.tsx
│   │   │   │       ├── logs.tsx
│   │   │   │       ├── personalization.tsx
│   │   │   │       └── instructors.tsx
│   │   │   └── lib/
│   │   └── public/
│   │
│   ├── api-server/           # 🔧 BACKEND (Express)
│   │   ├── package.json
│   │   ├── build.mjs
│   │   └── src/
│   │
│   └── mockup-sandbox/       # 🧪 SANDBOX (não usar em produção)
│
├── lib/
│   ├── api-client-react/     # Cliente API (React Query)
│   ├── api-spec/             # Especificação OpenAPI
│   ├── api-zod/              # Schemas Zod
│   └── db/                   # Banco de dados (Drizzle ORM)
│       ├── src/
│       │   ├── index.ts
│       │   └── schema/
│       │       ├── index.ts
│       │       ├── rbac.ts
│       │       ├── academy.ts
│       │       ├── quizzes.ts
│       │       ├── certificates.ts
│       │       ├── activities.ts
│       │       ├── banners.ts
│       │       ├── categories.ts
│       │       ├── instructors.ts
│       │       ├── notifications.ts
│       │       ├── analytics.ts
│       │       ├── logs.ts
│       │       ├── settings.ts
│       │       └── enrollments.ts
│       └── drizzle.config.ts
│
├── netlify/
│   └── functions/            # 🚀 NETLIFY FUNCTIONS
│       ├── _utils.js         # Helpers (JSON, CORS, auth)
│       ├── _rbac.js          # Middleware RBAC
│       ├── admin-api.js      # API Admin completa
│       ├── clerk-webhook.js  # Webhook Clerk → DB
│       ├── healthz.js        # Health check
│       ├── dashboard.js      # Dashboard data
│       ├── courses.js        # Lista cursos
│       ├── courses-courseId.js  # Detalhe curso
│       ├── courses-courseId-lessons-lessonId.js  # Detalhe aula
│       ├── progress-lessonId.js  # Progresso
│       ├── activities.js     # Atividades
│       └── ... (outros)
│
└── scripts/                  # Scripts auxiliares
```

---

## 🔧 CONFIGURAÇÃO NO NETLIFY

### 1. Criar Site no Netlify

1. Acesse https://app.netlify.com
2. Clique em **"Add new site" → "Import an existing project"**
3. Conecte com GitHub e selecione o repositório
4. Configure:

| Campo | Valor |
|-------|-------|
| **Base directory** | `artifacts/nativos-academy` |
| **Build command** | `pnpm install --ignore-scripts --frozen-lockfile && pnpm --filter @workspace/nativos-academy run build` |
| **Publish directory** | `dist/public` |

### 2. Variáveis de Ambiente

No Netlify Dashboard → **Site settings → Environment variables**, adicione:

| Variável | Descrição | Onde obter |
|----------|-----------|------------|
| `DATABASE_URL` | URL do PostgreSQL | Supabase → Settings → Database → Connection string |
| `CLERK_SECRET_KEY` | Chave secreta Clerk | Clerk Dashboard → API Keys → Secret keys |
| `VITE_CLERK_PUBLISHABLE_KEY` | Chave pública Clerk | Clerk Dashboard → API Keys → Publishable keys |
| `CLERK_WEBHOOK_SECRET` | Secret do webhook | Clerk Dashboard → Webhooks → Signing secret |
| `NODE_VERSION` | Versão do Node | `22` |

### 3. Configurar Webhook do Clerk

1. No **Clerk Dashboard**, vá em **Webhooks**
2. Clique em **"Add Endpoint"**
3. URL: `https://SEU-SITE.netlify.app/api/clerk/webhook`
4. Events: `user.created`, `user.updated`, `user.deleted`
5. Copie o **Signing Secret** e adicione como `CLERK_WEBHOOK_SECRET` no Netlify

---

## 🗄️ CONFIGURAÇÃO DO SUPABASE

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Anote a **URL do projeto** e a **senha do banco**

### 2. Executar Migrations

No **Supabase SQL Editor**, execute os comandos do arquivo `lib/db/src/schema/index.ts` para criar as tabelas.

Ou use o Drizzle Kit:

```bash
cd lib/db
pnpm push
```

### 3. Configurar RLS (Row Level Security)

No Supabase SQL Editor:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_lessons ENABLE ROW LEVEL SECURITY;
-- ... (demais tabelas)

-- Políticas para leitura pública (cursos publicados)
CREATE POLICY "Public read access for published courses"
ON academy_courses FOR SELECT
USING (status = 'published');

-- Políticas para escrita (apenas service role)
CREATE POLICY "Service role can insert courses"
ON academy_courses FOR INSERT
TO service_role
WITH CHECK (true);
```

---

## 🚀 DEPLOY

### Deploy Automático (Recomendado)

1. Push para GitHub:
```bash
git add .
git commit -m "feat: admin panel completo"
git push origin main
```

2. O Netlify detecta automaticamente e faz o deploy

3. Acompanhe em **Deploys** no Netlify Dashboard

### Deploy Manual

```bash
# Instalar dependências
pnpm install --ignore-scripts

# Build do frontend
pnpm --filter @workspace/nativos-academy run build

# Publicar (se usar Netlify CLI)
netlify deploy --prod --dir=artifacts/nativos-academy/dist/public
```

---

## ✅ CHECKLIST PÓS-DEPLOY

- [ ] Site acessível em `https://SEU-SITE.netlify.app`
- [ ] Login com Clerk funciona
- [ ] Usuário `nativos3d.adm@gmail.com` tem acesso ao `/admin`
- [ ] API responde em `/api/healthz`
- [ ] Netlify Functions estão ativas
- [ ] Banco de dados conectado
- [ ] Webhook do Clerk configurado
- [ ] Variáveis de ambiente definidas

---

## 🔍 DEBUG

### Ver logs das Functions

No Netlify Dashboard → **Functions** → Selecione a function → **Logs**

### Testar API localmente

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Rodar localmente
netlify dev
```

### Verificar banco de dados

No Supabase Dashboard → **Table Editor** → Verifique se as tabelas foram criadas

---

## 📞 SUPORTE

Se encontrar erros:

1. Verifique os **logs do build** no Netlify
2. Verifique os **logs das Functions**
3. Verifique se as **variáveis de ambiente** estão corretas
4. Verifique se o **webhook do Clerk** está configurado
5. Verifique se o **banco de dados** está acessível
