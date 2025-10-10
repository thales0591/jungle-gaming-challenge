# Jungle Gaming Challenge

Sistema de microserviços desenvolvido com NestJS, TypeORM e RabbitMQ, seguindo os princípios de Clean Architecture e Domain-Driven Design (DDD).

## Visão Geral

Este projeto implementa uma arquitetura de microserviços composta por:

- **Auth Service**: Serviço de autenticação e gerenciamento de usuários
- **Task Service**: Serviço de gerenciamento de tarefas
- **RabbitMQ**: Sistema de mensageria para comunicação assíncrona entre serviços

## Arquitetura

O projeto utiliza um monorepo gerenciado com **Turborepo** e **pnpm workspaces**, seguindo os seguintes padrões arquiteturais:

- **Clean Architecture**: Separação clara entre camadas de domínio, aplicação e infraestrutura
- **Domain-Driven Design**: Agregados, entidades e objetos de valor modelando o domínio
- **Event-Driven Architecture**: Comunicação entre serviços via eventos (RabbitMQ)
- **CQRS**: Separação de comandos e queries quando aplicável

### Estrutura do Projeto

```
jungle-gaming-challenge/
├── apps/
│   ├── auth-service/        # Serviço de autenticação
│   │   ├── @core/           # Camada de domínio e aplicação
│   │   └── apps/api/        # Camada de infraestrutura
│   └── task-service/        # Serviço de tarefas
│       ├── @core/           # Camada de domínio e aplicação
│       └── apps/api/        # Camada de infraestrutura
├── packages/
│   ├── eslint-config/       # Configurações compartilhadas do ESLint
│   ├── typescript-config/   # Configurações compartilhadas do TypeScript
│   └── ui/                  # Componentes UI compartilhados (se aplicável)
└── docker-compose.yml       # Configuração do RabbitMQ
```

## Tecnologias

### Core
- **Node.js** >= 18
- **TypeScript** 5.9+
- **NestJS** 11.x
- **TypeORM** 0.3.x
- **PostgreSQL** (banco de dados)
- **RabbitMQ** (mensageria)

### Autenticação & Segurança
- **Passport** com JWT
- **bcrypt** para hash de senhas

### Validação & Transformação
- **class-validator**
- **class-transformer**
- **Zod**

### Ferramentas de Desenvolvimento
- **Turborepo** (build system)
- **pnpm** (gerenciador de pacotes)
- **ESLint** & **Prettier** (qualidade de código)
- **Jest** (testes)

## Requisitos

- Node.js >= 18
- pnpm 9.0.0
- Docker & Docker Compose (para RabbitMQ e PostgreSQL)

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd jungle-gaming-challenge
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:

**Auth Service** (`apps/auth-service/.env`):
```env
# DB
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=auth-service
DB_PORT=5482
DB_HOST=localhost

# Mensageria
RABBITMQ_URL=amqp://admin:admin@localhost:5672
RABBITMQ_QUEUE=task_queue

# API
NODE_ENV=development
AUTH_SECRET="supersecret_access"
AUTH_REFRESH_SECRET="supersecret_refresh"
AUTH_ACCESS_EXPIRATION_SECONDS=900      # 15min
AUTH_REFRESH_EXPIRATION_SECONDS=604800  # 7d
```

**Task Service** (`apps/task-service/.env`):
```env
# DB
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=task-service
DB_PORT=5483
DB_HOST=localhost

# Mensageria
RABBITMQ_URL=amqp://admin:admin@localhost:5672

# API
NODE_ENV=development
AUTH_SECRET="supersecret_access"
AUTH_REFRESH_SECRET="supersecret_refresh"
AUTH_ACCESS_EXPIRATION_SECONDS=900      # 15min
AUTH_REFRESH_EXPIRATION_SECONDS=604800  # 7d
```

4. Inicie o RabbitMQ:
```bash
docker-compose up -d
```

5. Inicie os bancos de dados PostgreSQL para cada serviço:
```bash
# Auth Service
cd apps/auth-service
docker-compose up -d

# Task Service
cd apps/task-service
docker-compose up -d
```

6. Execute as migrações do banco de dados:

**Auth Service**:
```bash
cd apps/auth-service
pnpm migration:run
```

**Task Service**:
```bash
cd apps/task-service
pnpm migration:run
```

## Executando o Projeto

### Desenvolvimento

Execute todos os serviços em modo de desenvolvimento:
```bash
pnpm dev
```

Ou execute serviços individualmente:

**Auth Service**:
```bash
cd apps/auth-service
pnpm start:dev
```

**Task Service**:
```bash
cd apps/task-service
pnpm start:dev
```

### Produção

Build de todos os serviços:
```bash
pnpm build
```

Execute em modo de produção:
```bash
cd apps/auth-service
pnpm start:prod

cd apps/task-service
pnpm start:prod
```

## Scripts Disponíveis

### Root (Turborepo)
```bash
pnpm dev              # Inicia todos os serviços em modo desenvolvimento
pnpm build            # Build de todos os serviços
pnpm lint             # Lint em todos os serviços
pnpm format           # Formata código com Prettier
pnpm check-types      # Verifica tipos TypeScript
```

### Por Serviço (Auth/Task)
```bash
pnpm start:dev        # Modo desenvolvimento com watch
pnpm start:debug      # Modo debug
pnpm start:prod       # Modo produção
pnpm build            # Build do serviço
pnpm lint             # Lint do código
pnpm format           # Formata código
```

### Migrações TypeORM
```bash
pnpm migration:create <nome>    # Cria uma nova migration
pnpm migration:generate <nome>  # Gera migration a partir das entities
pnpm migration:run              # Executa migrations pendentes
pnpm migration:reset            # Reverte última migration
```

## Comunicação entre Serviços

O projeto utiliza **Event-Driven Architecture** com RabbitMQ para comunicação assíncrona:

1. **Auth Service** publica eventos quando um usuário é criado (`user.created`)
2. **Task Service** escuta esses eventos e atualiza seu contexto local

Exemplo de fluxo:
```
Auth Service (POST /users)
  → Cria usuário no DB
  → Publica evento "user.created" no RabbitMQ
  → Task Service escuta evento
  → Task Service cria representação local do usuário
```

## Padrões de Código

### Clean Architecture Layers

```
@core/
├── domain/           # Entidades, Value Objects, Domain Services
├── application/      # Use Cases, DTOs, Interfaces
└── infra/           # TypeORM config, migrations

apps/api/src/
└── infra/
    ├── modules/     # Controllers, NestJS Modules
    ├── ioc/         # Dependency Injection
    └── messaging/   # RabbitMQ producers/consumers
```

### Convenções

- **Entidades**: Agregados raiz e entidades do domínio
- **Value Objects**: Objetos imutáveis sem identidade
- **Use Cases**: Um caso de uso por arquivo, responsabilidade única
- **DTOs**: Validados com class-validator ou Zod
- **Repositories**: Interfaces na aplicação, implementações na infra

## Testes

```bash
# Executar testes
pnpm test

# Testes com coverage
pnpm test:cov

# Testes em modo watch
pnpm test:watch
```

## Troubleshooting

### RabbitMQ não conecta
```bash
# Verifique se o container está rodando
docker ps

# Acesse o management console
http://localhost:15672
# User: admin
# Pass: admin
```

### Erro de migration
```bash
# Reverta a última migration
pnpm migration:reset

# Execute novamente
pnpm migration:run
```

### Porta em uso
```bash
# Verifique processos usando a porta
lsof -i :3000
lsof -i :5672

# Mate o processo
kill -9 <PID>
```

## Gerenciamento RabbitMQ

Acesse o console de gerenciamento do RabbitMQ:
- **URL**: http://localhost:15672
- **User**: admin
- **Password**: admin

## Próximos Passos

- [ ] Implementar testes unitários e de integração
- [ ] Adicionar documentação Swagger/OpenAPI
- [ ] Implementar rate limiting e throttling
- [ ] Adicionar logs estruturados (Winston/Pino)
- [ ] Configurar CI/CD pipeline
- [ ] Implementar health checks
- [ ] Adicionar métricas e monitoring (Prometheus)
- [ ] Docker compose completo para ambiente de desenvolvimento

## Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
2. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
3. Push para a branch (`git push origin feature/nova-feature`)
4. Abra um Pull Request

### Commit Convention
Utilize [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `refactor:` refatoração de código
- `test:` adição ou correção de testes
- `chore:` tarefas de manutenção

## Licença

UNLICENSED - Projeto privado

---

Desenvolvido para o Jungle Gaming Challenge
