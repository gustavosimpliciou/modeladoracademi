# Deploy no Netlify e teste do administrador

O projeto usa a raiz do monorepo como Base directory. No painel do Netlify, configure Package directory como `artifacts/nativos-academy` (o log anterior apontava para o sandbox). O arquivo `netlify.toml` define o comando, a pasta publicada e as funções.

## Variáveis do Netlify

Configure os valores no painel, sem colocá-los no Git:

- `VITE_CLERK_PUBLISHABLE_KEY`: chave pública da mesma instância Clerk utilizada no backend; escopo Builds.
- `CLERK_SECRET_KEY`: chave secreta dessa instância; escopo Functions.
- `DATABASE_URL`: conexão PostgreSQL com permissão para criar/atualizar o schema; escopos Builds e Functions. Use a configuração TLS fornecida pelo provedor na URL.
- `CLERK_WEBHOOK_SECRET`: segredo de assinatura do endpoint Clerk; escopo Functions.
- `ADMIN_EMAIL`: opcional, padrão `nativos3d.adm@gmail.com`.
- `CLERK_AUTHORIZED_PARTIES`: opcional, lista de origens separadas por vírgula para domínio personalizado/ambiente local. Os endereços URL e DEPLOY_PRIME_URL do Netlify entram automaticamente na validação.

Nunca use o prefixo VITE_ para a chave secreta, segredo do webhook ou conexão do banco.

O build executa a verificação TypeScript e compila o site e as funções sem abrir uma conexão PostgreSQL. O banco é preparado numa transação no primeiro acesso administrativo com sessão e e-mail verificados, ou ao receber um webhook com assinatura válida. Uma tabela de versões evita repetir a preparação a cada chamada. Registros existentes são preservados. Colunas acrescentadas a tabelas históricas permitem NULL para preservar registros anteriores; isso não substitui futuras migrações versionadas de dados.

Para antecipar a preparação, execute `pnpm run db:migrate:netlify` num ambiente com DATABASE_URL configurada. Falhas reais de conexão retornam HTTP 503 no admin: um deploy publicado não comprova que o banco está acessível.

No Supabase, copie a URI do **Session pooler**, porta **5432**, no painel **Connect**. O endereço direto `db.…supabase.co` usa IPv6 por padrão; o pooler aceita IPv4. Use a URI inteira fornecida pelo painel, pois usuário e hostname são diferentes. Configure DATABASE_URL no escopo Functions do Netlify. Não divulgue a senha ou a URI completa. Confirme também que o projeto Supabase está ativo e que as restrições de rede permitem a conexão.

Referência: https://supabase.com/docs/guides/database/connecting-to-postgres

### Erro confirmado no site: DATABASE_URL must be a PostgreSQL connection string

Esse erro interrompe a função antes da autenticação do Clerk. Em Supabase → Connect → Session pooler, copie a conexão PostgreSQL e substitua o campo de senha pela senha do banco. No Netlify → Environment variables, edite DATABASE_URL no contexto Production e escopo Functions. Cole somente o valor da URI, sem aspas nem o prefixo DATABASE_URL=, e execute um novo deploy.

O formato é `postgresql://postgres.REFERENCIA:SENHA@HOST-DO-POOLER:5432/postgres`. Copie usuário e host exatos do painel; não use literalmente este exemplo. Caracteres especiais da senha precisam de codificação percentual na URI. O endereço `https://REFERENCIA.supabase.co` é a URL da API Supabase e não serve como DATABASE_URL. A chave anon/publishable e a service_role também não servem como conexão do banco.

Depois do deploy, uma chamada sem login a `/api/admin/me` deve retornar 401, em vez de 502. Com a sessão e o e-mail administrador verificados, deve retornar 200 e SUPER_ADMIN. O aviso de chaves de desenvolvimento do Clerk não explica o erro de formato do banco.

## Testar

1. Aguarde o deploy ficar Published e abra a URL fornecida pelo Netlify.
2. Entre ou crie a conta `nativos3d.adm@gmail.com` e verifique esse e-mail no Clerk.
3. Abra `/admin`. O servidor valida a sessão e provisiona o papel SUPER_ADMIN no primeiro acesso, sem depender do webhook ter sido recebido previamente.
4. Abra Cursos, crie um curso de teste, recarregue e confirme a persistência. Edite o título, publique/despublique e exclua o curso de teste.
5. Abra Configurações e salve a marca; recarregue e confirme o valor salvo. Confira os eventos em Logs.
6. Uma conta comum deve receber acesso negado ao abrir `/admin`.

Depois de ter a URL, configure o webhook do Clerk para `https://SEU-SITE/api/clerk/webhook`, com os eventos user.created, user.updated e user.deleted. Se usar uma instância de produção do Clerk, configure o domínio de produção nela conforme a documentação do Clerk.

## Validação local

- `pnpm run typecheck`
- `pnpm run build:netlify`
- `pnpm run test:netlify`

Os testes usam PostgreSQL embarcado (PGlite) e simulam a resposta de verificação do Clerk para testar autorização, provisionamento e operações no banco. A produção utiliza o SDK oficial do Clerk, incluindo assinatura e validade do token. Um webhook sem assinatura é rejeitado pelo verificador real.

A publicação e o login real só podem ser confirmados após o Netlify executar o novo build com as variáveis reais. O catálogo e o progresso do aluno ainda têm funções demonstrativas legadas; este reparo cobre compilação, deploy e acesso administrativo, sem declarar a plataforma de ensino inteira concluída.

Referências: https://clerk.com/docs/reference/backend/verify-token e https://docs.netlify.com/build/functions/configuration/.
