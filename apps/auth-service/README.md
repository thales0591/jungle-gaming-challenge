### API de tasks — NestJS + Prisma + PostgreSQL

Validação com class-validator e arquitetura em camadas (domain / application / infra).

📦 Instalação
1) Clonar o repositório e instalar dependências
```bash
  pnpm install
```

2) Subir o db (docker necessário)
```bash
  docker compose up -d
```

3) Rodar as migrations
```bash
  pnpm run prisma:migrate
```

4) Configurar o env - copie e cole o .env.example para um novo arquivo .env, caso você tenha configurado outro banco, coloque a URL dele lá

5) Rodar a aplicação
```bash
  pnpm run start:dev
```