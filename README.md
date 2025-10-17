# Jungle Gaming Challenge

Sistema de gerenciamento de tarefas desenvolvido com arquitetura de microserviços, seguindo princípios de Clean Architecture e Domain-Driven Design (DDD).

## Visão Geral

Aplicação completa para gerenciamento de tarefas com sistema de notificações em tempo real, autenticação JWT e comunicação assíncrona entre serviços.

## Arquitetura

```
┌─────────────┐
│   Web App   │ (React + Vite + TanStack Router)
│  (Port 3000)│
└──────┬──────┘
       │ HTTP
       ↓
┌─────────────────┐
│  API Gateway    │ (NestJS + Proxy + JWT Auth + Rate Limiting)
│   (Port 4000)   │
└────────┬────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
    ↓                             ↓
┌─────────────┐           ┌──────────────┐
│Auth Service │           │ Task Service │
│ (Port 3333) │           │  (Port 3334) │
└──────┬──────┘           └───────┬──────┘
       │                          │
       ↓                          ↓
┌─────────────┐           ┌──────────────┐
│PostgreSQL   │           │ PostgreSQL   │
│ (Port 5482) │           │  (Port 5483) │
└─────────────┘           └──────────────┘
       │                          │
       └──────────┬───────────────┘
                  ↓
          ┌──────────────┐
          │   RabbitMQ   │ (Message Broker)
          │ (Port 5672)  │
          └──────┬───────┘
                 │
                 ↓
     ┌────────────────────┐
     │Notifications Service│ (WebSocket Gateway)
     │    (Port 3335)      │
     └────────────────────┘
                 │
                 ↓
          ┌─────────────┐
          │ PostgreSQL  │
          │ (Port 5484) │
          └─────────────┘
```

## Estrutura do Projeto

```
jungle-gaming-challenge/
├── apps/
│   ├── auth-service/          # Microserviço de autenticação
│   │   ├── @core/             # Domain + Use Cases
│   │   │   ├── domain/        # Entities, Value Objects
│   │   │   ├── application/   # Use Cases
│   │   │   └── infra/         # TypeORM, Adapters
│   │   └── apps/api/src/      # Infrastructure Layer
│   │       └── infra/
│   │           ├── modules/   # Controllers
│   │           ├── ioc/       # DI Container
│   │           └── messaging/ # RabbitMQ
│   │
│   ├── task-service/          # Microserviço de tarefas
│   │   └── (mesma estrutura)
│   │
│   ├── notifications-service/ # Microserviço de notificações
│   │   └── (mesma estrutura)
│   │
│   ├── api-gateway/          # Gateway principal
│   │   └── apps/api/src/
│   │       └── infra/
│   │           ├── modules/
│   │           │   ├── proxy/          # Proxy service
│   │           │   ├── gateway.controller.ts
│   │           │   └── health/         # Health checks
│   │           ├── middlewares/
│   │           │   └── passport/       # JWT Strategy
│   │           └── decorators/
│   │
│   └── web/                   # Frontend React
│       ├── src/
│       │   ├── components/    # UI Components
│       │   ├── pages/         # TanStack Router pages
│       │   ├── services/      # API clients
│       │   ├── hooks/         # Custom hooks
│       │   └── lib/           # Utils, store, validations
│       └── Dockerfile
│
├── packages/
│   ├── eslint-config/        # Shared ESLint config
│   ├── typescript-config/    # Shared tsconfig
│   └── ui/                   # Shared UI components
│
└── docker-compose.yml        # Orchestration completa
```

## 🚀 Quick Start

### Opção 1: Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone <repository-url>
cd jungle-gaming-challenge

# Instale as dependências
pnpm install

# Suba todos os serviços
docker compose up -d

# Execute as migrations
docker exec auth-service pnpm migration:run
docker exec task-service pnpm migration:run
docker exec notifications-service pnpm migration:run

# Acesse a aplicação
# Frontend: http://localhost:3000
# API Gateway: http://localhost:4000/api
# RabbitMQ Management: http://localhost:15672 (admin/admin)
```

### Opção 2: Desenvolvimento Local

```bash
# Instale as dependências
pnpm install

# Suba o RMQ a partir do root
docker compose up -d rabbitmq

# Suba a infraestrutura que cada serviço precisa (auth, task e notification precisam de DB) e suas migrations
docker compose up -d
pnpm run migration:run

# Configure os .env de cada serviço criando um .env e usando o .env.example como base

# Inicie os serviços backend em desenvolvimento
pnpm run start:dev

# Inicie o serviço web em desenvolvimento
pnpm run dev
```

## Variáveis de Ambiente

### Auth Service (`.env`)
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=auth-service
DB_PORT=5432
DB_HOST=localhost  # ou postgres-auth no Docker

RABBITMQ_URL=amqp://admin:admin@localhost:5672  # ou @rabbitmq:5672 no Docker
RABBITMQ_QUEUE=auth_queue

PORT=3333
NODE_ENV=development
AUTH_SECRET=supersecret_access
AUTH_REFRESH_SECRET=supersecret_refresh
AUTH_ACCESS_EXPIRATION_SECONDS=900
AUTH_REFRESH_EXPIRATION_SECONDS=604800
```

### Task Service (`.env`)
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=task-service
DB_PORT=5432
DB_HOST=localhost  # ou postgres-task no Docker

RABBITMQ_URL=amqp://admin:admin@localhost:5672
RABBITMQ_QUEUE=auth_queue
RABBITMQ_NOTIFICATIONS_QUEUE=notifications_queue

PORT=3334
NODE_ENV=development
```

### Notifications Service (`.env`)
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=notifications-service
DB_PORT=5432
DB_HOST=localhost  # ou postgres-notifications no Docker

RABBITMQ_URL=amqp://admin:admin@localhost:5672
RABBITMQ_NOTIFICATIONS_QUEUE=notifications_queue

AUTH_SECRET=supersecret_access
AUTH_REFRESH_SECRET=supersecret_refresh

PORT=3335
NODE_ENV=development
```

### API Gateway (`.env`)
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=supersecret_jwt
JWT_TOKEN_EXPIRATION_SECONDS=900
AUTH_SERVICE_URL=http://localhost:3333  # ou http://auth-service:3333 no Docker
TASKS_SERVICE_URL=http://localhost:3334
NOTIFICATIONS_SERVICE_URL=http://localhost:3335
```

### Web App (`.env`)
```env
VITE_API_URL=http://localhost:4000/api
```

## Scripts Disponíveis

### Root (Monorepo)
```bash
pnpm test             # Executa todos os testes
pnpm test:coverage    # Testes com coverage
```

### Por Serviço
```bash
# Desenvolvimento
pnpm start:dev        # Modo watch

# Produção
pnpm build
pnpm start:prod

# Migrations (apenas serviços NestJS)
pnpm migration:create <nome>
pnpm migration:generate <nome>
pnpm migration:run
pnpm migration:reset
```

## Decisões Técnicas

### Clean Architecture
- **Separação de camadas**: Domain, Application, Infrastructure
- **Inversão de dependência**: Use cases dependem de interfaces
- **Domain puro**: Sem dependências externas no domínio
- **Trade-off**: Mais código boilerplate vs maior testabilidade

### Event-Driven com RabbitMQ
- **Por quê?**: Desacoplamento entre serviços
- **Trade-off**: Eventual consistency vs escalabilidade
- **Uso**: Auth publica `user.created` → Task consome

### WebSocket para Notificações
- **Socket.IO escolhido**: Mais maduro e fácil fallback
- **Alternativa considerada**: Server-Sent Events (SSE)

## Problemas Conhecidos / Limitações

Falta de observabilidade, estou estudando sobre o assunto no momento. 
Sobre a parte de websocket, foi minha primeira vez aplicando então acho que devo ter feito configurações acopladas ou não tão bem feitas. Sobre o refresh token no front-end acho que ficou muito verboso, normalmente eu fazia com context api, acho que o fato de eu ter seguido com zustand me fez ter overengineering pra manter a revalidação do token durante a sessão.
Sobre a parte de auth secret, acho que dava pra ter usado uma assimétrica pra não precisar compartilhar a privada entre todas.
Sobre o User Read Model que tenho no task service, não sei se foi a melhor alternativa pensando na replicação dos dados e na inconsistência que isso pode causar.

## Tempo Gasto (10 corridos)

| Dia | Atividade | Tempo |
|-----|-----------|-------|
| 1 | Auth Service (domínio, use cases, controllers, JWT) | ~8h |
| 2 | Task Service (domínio completo, relacionamentos) | ~8h |
| 3 | API Gateway (proxy, rate limiting, JWT validation) | ~8h |
| 4 | Notifications Service (WebSocket, RabbitMQ consumers) | ~8h |
| 5 | Frontend - Parte 1 (setup, auth, routing) | ~8h |
| 6 | Frontend - Parte 2 (tasks CRUD, UI/UX) | ~8h |
| 7 | WebSocket integration + Notificações em tempo real | ~8h |
| 8 | Testes unitários, Swagger, health checks, ajustes | ~8h |
| 9 | Revisão | sem cálcuo aproximado |
| 10 | Dockerização (docker-compose, Dockerfiles) | ~2h |

## Testes

```bash
# Todos os testes
pnpm test

# Com coverage
pnpm test:coverage

# Por serviço
pnpm test:auth          # Auth service only
pnpm test:task          # Task service only
pnpm test:notifications # Notifications service only

### Coverage Atual
- 91.42% levando em considerações partes testáveis (use cases + entities + value-objects)

## 📚 Documentação API

### Swagger/OpenAPI
Acesse: `http://localhost:4000/api/docs`

### Health Checks
- Auth: `http://localhost:3333/health`
- Task: `http://localhost:3334/health`
- Notifications: `http://localhost:3335/health`
- Gateway: `http://localhost:4000/api/health`

**Desenvolvido por Thales**
