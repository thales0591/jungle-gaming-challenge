
Criar as telas de um Sistema de Gestão de Tarefas Colaborativo seguindo as especificações técnicas e de design abaixo.

### Stack Técnica
- **Framework**: React.js com TypeScript
- **Roteamento**: TanStack Router
- **UI Library**: shadcn/ui
- **Estilização**: Tailwind CSS
- **Validação de Formulários**: react-hook-form + zod
- **Estado Global**: Zustand (para autenticação)
- **Comunicação Tempo Real**: WebSocket para notificações
- **Diferencial**: TanStack Query para gerenciamento de dados assíncronos


A Interface deve ser responsiva (mobile-first). Feedback visual claro (loading states, toast notifications). Skeleton loaders com shimmer effect para carregamento. Transições suaves entre estados. Acessibilidade (aria-labels, navegação por teclado)

Telas a Serem Desenvolvidas:

### 1. Tela de Login/Registro (Modal ou Página)

#### Descrição
Modal ou página com tabs para alternar entre Login e Registro.

#### Layout
- **Login Tab**:
  - Campo: Email (input type="email")
  - Campo: Senha (input type="password" com toggle para mostrar/ocultar)
  - Checkbox: "Lembrar-me"
  - Botão: "Entrar" (primário)
  - Link: "Esqueceu a senha?" (desabilitado/placeholder)
  - Link: "Não tem conta? Cadastre-se"

- **Registro Tab**:
  - Campo: Nome de usuário (username, validação: min 3 caracteres)
  - Campo: Email (validação de formato)
  - Campo: Senha (validação: min 8 caracteres, 1 maiúscula, 1 número)
  - Campo: Confirmar senha (deve ser igual à senha)
  - Botão: "Criar conta" (primário)
  - Link: "Já tem conta? Faça login"

#### Validações (zod + react-hook-form)
- Email: formato válido
- Senha: mínimo 8 caracteres, pelo menos 1 maiúscula e 1 número
- Username: mínimo 3 caracteres
- Confirmar senha: deve corresponder à senha

#### Comportamentos
- Loading state no botão durante autenticação
- Toast de erro para credenciais inválidas
- Toast de sucesso ao registrar
- Redirecionamento automático para lista de tarefas após login bem-sucedido
- Foco automático no primeiro campo ao abrir modal

#### Estados
- Idle (formulário vazio)
- Validating (durante digitação)
- Submitting (aguardando resposta da API)
- Success (redirecionar)
- Error (mostrar mensagem de erro)

---

### 2. Tela de Lista de Tarefas (Dashboard Principal)

#### Descrição
Dashboard principal com listagem paginada de tarefas, filtros, busca e ações rápidas.

#### Layout

**Header**:
- Logo/Título do app à esquerda
- Barra de busca centralizada (input com ícone de lupa)
- Avatar do usuário + dropdown menu à direita (perfil, configurações, logout)
- Botão "Nova Tarefa" (primário, destaque)
- Ícone de notificações com badge de contador (se houver novas)

**Filtros e Controles** (barra horizontal abaixo do header):
- Filtro por Status: Select com opções (Todas, TODO, IN_PROGRESS, REVIEW, DONE)
- Filtro por Prioridade: Select com opções (Todas, LOW, MEDIUM, HIGH, URGENT)
- Filtro por Atribuído: Combobox multi-select de usuários
- Ordenação: Dropdown (Mais recente, Mais antiga, Prazo mais próximo, Prioridade)
- Botão "Limpar filtros"

**Grid/Lista de Tarefas**:
- Layout: Grid responsivo (1 coluna mobile, 2-3 colunas tablet/desktop)
- Cada tarefa como Card contendo:
  - **Cabeçalho do Card**:
    - Título da tarefa (texto destacado, truncado se muito longo)
    - Badge de prioridade (LOW=verde, MEDIUM=amarelo, HIGH=laranja, URGENT=vermelho)
    - Badge de status (TODO=cinza, IN_PROGRESS=azul, REVIEW=roxo, DONE=verde)
  - **Corpo do Card**:
    - Descrição resumida (2-3 linhas, com "..." se truncado)
    - Prazo (data) com ícone de calendário (destacar em vermelho se atrasado)
  - **Rodapé do Card**:
    - Avatares dos usuários atribuídos (máximo 3 visíveis + contador "+X")
    - Contador de comentários (ícone + número)
    - Dropdown menu (três pontos) com ações: Editar, Excluir, Duplicar
  - **Hover State**: elevar card, mostrar border colorido
  - **Click**: redirecionar para página de detalhes

#### Estados
- **Loading**: Skeleton loaders no lugar dos cards (shimmer effect)
- **Empty State**: Ilustração + texto "Nenhuma tarefa encontrada" + botão "Criar primeira tarefa"
- **Error State**: Mensagem de erro + botão "Tentar novamente"
- **Success**: Grid com cards de tarefas

#### Interações
- Busca em tempo real (debounce de 500ms)
- Filtros aplicados automaticamente ao alterar
- Notificações WebSocket: toast quando nova tarefa for atribuída ou atualizada
- Atualização automática da lista ao receber eventos WebSocket

### 3. Modal de Criação/Edição de Tarefa

#### Descrição
Modal ou drawer lateral para criar ou editar uma tarefa.

#### Layout
- **Header**: Título "Nova Tarefa" ou "Editar Tarefa" + botão fechar (X)
- **Formulário**:
  - Campo: Título (input obrigatório, max 100 caracteres)
  - Campo: Descrição (textarea, max 500 caracteres, com contador)
  - Campo: Prazo (date picker)
  - Campo: Prioridade (select: LOW, MEDIUM, HIGH, URGENT)
  - Campo: Status (select: TODO, IN_PROGRESS, REVIEW, DONE) - apenas em edição
  - Campo: Atribuir a (combobox multi-select de usuários com busca)
- **Footer**:
  - Botão "Cancelar" (secundário)
  - Botão "Salvar" ou "Criar Tarefa" (primário)

#### Validações
- Título: obrigatório, min 3 caracteres
- Descrição: opcional, max 500 caracteres
- Prazo: data futura (opcional)
- Prioridade: obrigatória
- Status: obrigatório (pré-selecionado como TODO em criação)

#### Comportamentos
- Loading state no botão "Salvar" durante requisição
- Toast de sucesso ao criar/editar
- Toast de erro em caso de falha
- Fechar modal automaticamente após sucesso
- Validação em tempo real (mostrar erros abaixo dos campos)

---

### 4. Tela de Detalhes da Tarefa

#### Descrição
Página completa dedicada a uma tarefa específica, com visualização detalhada, comentários e histórico.

#### Layout

**Cabeçalho**:
- Breadcrumb: Tarefas > [Título da tarefa]
- Botão "Voltar" à esquerda
- Botões de ação à direita: "Editar", "Excluir" (com confirmação)

**Seção Principal** (2 colunas em desktop, 1 coluna em mobile):

**Coluna Esquerda (Informações da Tarefa)**:
- Título da tarefa (grande, editável inline ou abre modal)
- Badges de status e prioridade
- Descrição completa (texto formatado)
- **Metadados** (grid de informações):
  - Criado por: Avatar + nome do criador
  - Data de criação: timestamp
  - Prazo: data com ícone (destacar se atrasado)
  - Última atualização: timestamp
- **Usuários Atribuídos**:
  - Lista de avatares + nomes
  - Botão "Adicionar usuário" (abre combobox)
  - Opção de remover usuários (hover mostra X)

**Coluna Direita (Histórico de Alterações)**:
- **Tabs**: "Comentários" e "Histórico"

  **Tab Comentários**:
  - Lista de comentários (ordenação cronológica inversa - mais recente no topo)
  - Cada comentário contém:
    - Avatar + nome do autor
    - Timestamp relativo ("há 5 minutos")
    - Texto do comentário
    - (Opcional) botão editar/excluir se for autor
  - Campo de novo comentário (textarea + botão "Enviar")
  - Loading state ao enviar comentário
  - Scroll automático para novo comentário

  **Tab Histórico**:
  - Timeline de alterações (audit log):
    - Ícone representando tipo de alteração (criação, edição, status mudou, etc.)
    - Descrição: "João alterou status de TODO para IN_PROGRESS"
    - Timestamp
  - Scroll infinito ou paginação

#### Estados
- **Loading**: Skeleton loader para toda a página
- **Error**: Mensagem de erro + botão "Voltar"
- **Not Found**: "Tarefa não encontrada" + botão "Voltar à lista"

#### Interações
- WebSocket: atualização em tempo real de comentários e histórico
- Toast de notificação quando comentário é adicionado por outro usuário
- Confirmação ao excluir tarefa ("Tem certeza?")

---

### 5. Componente de Notificações (Dropdown/Panel)

#### Descrição
Painel de notificações acessível pelo ícone no header.

#### Layout
- **Trigger**: Ícone de sino com badge de contador (número de não lidas)
- **Dropdown Panel**:
  - Header: "Notificações" + link "Marcar todas como lidas"
  - Lista de notificações (scroll, max 5 visíveis + "Ver todas"):
    - Avatar do usuário que gerou a notificação
    - Texto descritivo: "João comentou em [Tarefa X]"
    - Timestamp relativo
    - Indicador visual de não lida (ponto colorido ou fundo destacado)
    - Click: redireciona para tarefa relacionada
  - Empty state: "Nenhuma notificação"

#### Comportamentos
- Atualização em tempo real via WebSocket
- Badge atualiza automaticamente
- Som/vibração opcional ao receber notificação (preferência do usuário)
- Auto-fechar após click em notificação

---

## Requisitos Técnicos de Implementação

### Estrutura de Pastas (sugerida)
```
apps/web/src/
├── components/
│   ├── ui/                 # componentes shadcn/ui
│   ├── layout/             # Header, Sidebar, Footer
│   ├── tasks/              # TaskCard, TaskList, TaskForm
│   ├── auth/               # LoginForm, RegisterForm
│   └── notifications/      # NotificationPanel, NotificationItem
├── pages/
│   ├── index.tsx           # Dashboard (lista de tarefas)
│   ├── tasks/
│   │   └── [id].tsx        # Detalhes da tarefa
│   └── auth.tsx            # Login/Register (se não for modal)
├── hooks/
│   ├── useAuth.ts          # autenticação
│   ├── useTasks.ts         # TanStack Query hooks
│   ├── useWebSocket.ts     # conexão WebSocket
│   └── useNotifications.ts # gerenciamento de notificações
├── context/
│   └── AuthContext.tsx     # Context API para auth
├── lib/
│   ├── api.ts              # cliente HTTP (axios/fetch)
│   ├── websocket.ts        # configuração WebSocket
│   └── utils.ts            # funções auxiliares
├── schemas/
│   └── validations.ts      # schemas zod
└── types/
    └── index.ts            # tipos TypeScript
```

### Validação com Zod
Crie schemas zod para:
- LoginFormSchema (email, password)
- RegisterFormSchema (username, email, password, confirmPassword)
- TaskFormSchema (title, description, deadline, priority, status, assignedUsers)
- CommentFormSchema (content)

### WebSocket Integration
- Conectar ao WebSocket após autenticação
- Escutar eventos: `task:created`, `task:updated`, `comment:new`
- Atualizar UI automaticamente ao receber eventos
- Mostrar toast notifications para eventos relevantes
- Reconectar automaticamente em caso de desconexão

### TanStack Query (Diferencial)
- Queries para: `getTasks`, `getTaskById`, `getComments`
- Mutations para: `createTask`, `updateTask`, `deleteTask`, `createComment`
- Invalidação de cache ao receber eventos WebSocket
- Configurar stale time e refetch strategies

### Loading & Error States
- **Skeleton Loaders**: usar componente Skeleton do shadcn/ui com animação shimmer
- **Toast Notifications**: usar componente Toast do shadcn/ui para feedback
- **Error Boundaries**: capturar erros React e mostrar fallback UI

### Responsividade
- Mobile: 1 coluna, menu hamburguer, drawer lateral
- Tablet: 2 colunas de tarefas, sidebar colapsável
- Desktop: 3 colunas de tarefas, sidebar fixa

---

## Checklist de Entrega

- [ ] Modal/Página de Login com validação completa
- [ ] Modal/Página de Registro com validação completa
- [ ] Dashboard com lista de tarefas paginada
- [ ] Filtros por status, prioridade e usuários
- [ ] Busca em tempo real
- [ ] Cards de tarefa com todas as informações
- [ ] Modal de criação/edição de tarefas
- [ ] Página de detalhes da tarefa
- [ ] Sistema de comentários
- [ ] Histórico de alterações (timeline)
- [ ] Painel de notificações com badge
- [ ] Integração WebSocket funcional
- [ ] Skeleton loaders em todas as telas
- [ ] Toast notifications para feedback
- [ ] Validação com zod + react-hook-form
- [ ] Layout responsivo (mobile, tablet, desktop)
- [ ] Mínimo 5 componentes shadcn/ui utilizados
- [ ] TanStack Query configurado (diferencial)

---

## Observações Finais

### Priorização
1. **MVP (Mínimo Viável)**:
   - Login/Registro funcional
   - Lista de tarefas com CRUD básico
   - Detalhes da tarefa com comentários

2. **Funcionalidades Completas**:
   - Filtros e busca avançada
   - WebSocket para notificações
   - Histórico de alterações

3. **Diferenciais**:
   - TanStack Query
   - Animações e micro-interactions

### Boas Práticas
- Componentização: criar componentes reutilizáveis
- TypeScript: tipar todas as props, states e responses
- Acessibilidade: usar semantic HTML e ARIA labels
- Performance: lazy loading, code splitting
- Clean Code: nomes descritivos, comentários quando necessário

---

## API Endpoints (referência)

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

GET    /api/tasks?page=1&size=10&status=TODO&priority=HIGH&search=termo
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id

POST   /api/tasks/:id/comments
GET    /api/tasks/:id/comments?page=1&size=20
```

### WebSocket Events
- `task:created` - nova tarefa criada
- `task:updated` - tarefa atualizada (status, prioridade, etc.)
- `comment:new` - novo comentário em tarefa

---

**Boa sorte! Crie telas lindas, funcionais e que proporcionem uma experiência incrível ao usuário.**
