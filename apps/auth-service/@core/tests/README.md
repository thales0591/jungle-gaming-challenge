# Auth Service - Testes Unitários

Este diretório contém os testes unitários para o Auth Service, seguindo a arquitetura hexagonal (Ports & Adapters).

## Estrutura

```
tests/
├── setup.ts                    # Configuração global dos testes (mocks de uuid)
├── utils/
│   ├── fakes/                  # Implementações fake dos adapters
│   │   ├── fake-auth-token.ts  # Mock do AuthToken
│   │   ├── fake-encrypter.ts   # Mock do Encrypter
│   │   └── fake-event-publisher.ts # Mock do EventPublisher
│   ├── repositories/           # Implementações in-memory dos repositories
│   │   └── in-memory-user-repository.ts
│   └── factories/              # Factories para criar entidades de teste
│       └── make-user.ts
└── usecases/                   # Testes dos casos de uso
    ├── login.spec.ts
    ├── register.spec.ts
    └── refresh-token.spec.ts
```

## Executando os Testes

### Do root do projeto:

```bash
# Rodar todos os testes de todos os serviços
pnpm test

# Rodar apenas testes do auth-service
pnpm test:auth

# Rodar em modo watch
pnpm test:watch

# Rodar com coverage
pnpm test:coverage
```

### Do diretório do auth-service:

```bash
cd apps/auth-service/@core
npx jest
```

## Padrões de Teste

### Estrutura de um teste de use case

```typescript
import { UseCaseClass } from '@core/application/usecases/use-case';
import { InMemoryRepository } from '../utils/repositories/in-memory-repository';
import { FakeAdapter } from '../utils/fakes/fake-adapter';

let repository: InMemoryRepository;
let adapter: FakeAdapter;
let sut: UseCaseClass; // System Under Test

describe('UseCaseClass', () => {
  beforeEach(() => {
    // Criar novas instâncias antes de cada teste
    repository = new InMemoryRepository();
    adapter = new FakeAdapter();
    sut = new UseCaseClass(repository, adapter);
  });

  it('should do something', async () => {
    // Arrange: Preparar os dados
    const input = { /* ... */ };

    // Act: Executar o caso de uso
    const result = await sut.execute(input);

    // Assert: Verificar o resultado
    expect(result).toBeDefined();
  });
});
```

### Usando Factories

As factories facilitam a criação de entidades com valores padrão:

```typescript
import { makeUser } from '../utils/factories/make-user';

// Criar usuário com valores padrão
const user = makeUser();

// Sobrescrever propriedades específicas
const customUser = makeUser({
  email: 'custom@example.com',
  name: 'Custom Name'
});

// Criar com ID específico
const userWithId = makeUser({}, UniqueId.create('specific-id'));
```

## Mocks e Fakes

### FakeEncrypter
Simula operações de hash e comparação de senha:
- `hash()`: Adiciona '-hashed' ao final da string
- `compare()`: Verifica se a string + '-hashed' é igual ao hash

### FakeAuthToken
Simula geração e validação de tokens JWT:
- Armazena tokens em memória
- Gera tokens únicos usando timestamp + contador
- Valida tokens verificando se existem no mapa

### FakeEventPublisher
Simula publicação de eventos:
- Armazena eventos em array
- Método `findEvent()` para verificar eventos publicados
- Método `clear()` para limpar eventos

### InMemoryUserRepository
Implementação em memória do UserRepository:
- Array `items` público para manipulação direta nos testes
- Map para armazenar refresh tokens
- Todos os métodos do contrato UserRepository

## Cobertura de Testes

Os testes cobrem os seguintes use cases:

- **RegisterUseCase**: 5 testes
  - Registro de novo usuário
  - Hash de senha
  - Emissão de evento
  - Validação de email duplicado
  - Validação de senha fraca

- **LoginUseCase**: 6 testes
  - Login com credenciais válidas
  - Geração de tokens
  - Salvamento de refresh token
  - Erro para usuário inexistente
  - Erro para senha incorreta
  - UnauthorizedException

- **RefreshTokenUseCase**: 6 testes
  - Renovação de tokens
  - Geração de novos tokens
  - Invalidação do token antigo
  - Erro para token inválido
  - Erro para token revogado
  - UnauthorizedException

Total: **17 testes** ✅
