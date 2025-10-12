# API Gateway - Guia de Integração

## Visão Geral

O API Gateway foi configurado para:
- Validar tokens JWT localmente (sem chamar o auth-service)
- Proteger rotas automaticamente
- Encaminhar requisições para os serviços backend
- Passar informações do usuário via headers customizados

## Estrutura de Rotas

```
API Gateway (porta 4000)
├── /api/auth/*  → Auth Service (porta 3000) [PÚBLICO]
└── /api/tasks/* → Tasks Service (porta 3001) [PROTEGIDO]
```

## Fluxo de Autenticação

1. **Login** (rota pública)
   ```bash
   POST http://localhost:4000/api/auth/login
   Body: { "email": "user@example.com", "password": "123456" }
   Response: { "accessToken": "eyJhbG..." }
   ```

2. **Acessar recursos protegidos**
   ```bash
   GET http://localhost:4000/api/tasks
   Headers: { "Authorization": "Bearer eyJhbG..." }
   ```

3. **Gateway valida JWT localmente**
   - Extrai `userId` do token
   - Adiciona `userId` em `req.user`
   - Encaminha para o serviço com header `x-user-id`

## Configuração dos Serviços

### 1. API Gateway (.env)
```env
PORT=4000
NODE_ENV=development
JWT_SECRET=supersecret_access
JWT_TOKEN_EXPIRATION_SECONDS=900
AUTH_SERVICE_URL=http://localhost:3000/api
TASKS_SERVICE_URL=http://localhost:3001/api
```

### 2. Auth Service (.env)
```env
# Deve usar o MESMO JWT_SECRET
AUTH_SECRET=supersecret_access
AUTH_ACCESS_EXPIRATION_SECONDS=900
```

### 3. Tasks Service
Não precisa de configuração JWT, apenas ler o header `x-user-id`:

```typescript
@Controller('tasks')
export class TasksController {
  @Post()
  async createTask(
    @Headers('x-user-id') userId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    // userId vem do Gateway, já validado
    return this.tasksService.create(userId, createTaskDto);
  }
}
```

## Rotas Públicas vs Protegidas

### Marcar rota como PÚBLICA
```typescript
import { Public } from '../decorators/public.decorator';

@Public()
@Get('public-endpoint')
async getPublicData() {
  return { message: 'Acessível sem autenticação' };
}
```

### Rota PROTEGIDA (padrão)
```typescript
// Não precisa de decorator, já é protegida por padrão
@Get('protected-endpoint')
async getProtectedData(@LoggedUserId() userId: string) {
  return { userId };
}
```

## Decoradores Disponíveis

### @LoggedUser()
Retorna o objeto completo do usuário:
```typescript
@Get('me')
async getMe(@LoggedUser() user: { userId: string }) {
  return user;
}
```

### @LoggedUserId()
Retorna apenas o ID do usuário:
```typescript
@Post()
async create(@LoggedUserId() userId: string, @Body() dto: CreateDto) {
  return this.service.create(userId, dto);
}
```

## Como Iniciar

1. **Instalar dependências**
   ```bash
   cd apps/api-gateway
   pnpm install
   ```

2. **Configurar .env**
   ```bash
   cp .env.example .env
   # Editar .env com as configurações corretas
   ```

3. **Iniciar o Gateway**
   ```bash
   pnpm start:dev
   ```

4. **Verificar**
   ```
   [Nest] LOG [Bootstrap] API Gateway running on http://localhost:4000/api
   ```

## Testando a Integração

### 1. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

### 2. Acessar recurso protegido
```bash
curl http://localhost:4000/api/tasks \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 3. Verificar logs
O Gateway logará todas as requisições encaminhadas:
```
[TasksProxyService] Forwarding GET http://localhost:3001/api/tasks
```

## Troubleshooting

### Erro: "Unauthorized"
- Verifique se o token está sendo enviado no header `Authorization: Bearer <token>`
- Confirme que o `JWT_SECRET` é o mesmo no Gateway e Auth Service
- Verifique se o token não expirou

### Erro: "Cannot connect to service"
- Verifique se os serviços backend estão rodando nas portas corretas
- Confirme as URLs em `AUTH_SERVICE_URL` e `TASKS_SERVICE_URL`

### Erro de compilação TypeScript
- Execute `pnpm build` para verificar erros
- Certifique-se de que os tipos estão corretos em `apps/api/src/@types/express.d.ts`
