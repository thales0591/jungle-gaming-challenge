import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { TaskModal } from "@/components/tasks/task-modal"
import { CommentList } from "@/components/tasks/comment-list"
import { ArrowLeft, Calendar, Pencil, Trash2, Clock, User } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Task, TaskHistory, Comment } from "@/types"

export const Route = createFileRoute("/tasks/$id")({
  component: TaskDetailPage,
});

// Mock data
const mockTask: Task = {
  id: "1",
  title: "Implementar autenticação com JWT",
  description:
    "Adicionar sistema de autenticação usando JSON Web Tokens para segurança da API. Isso inclui implementação de login, registro, refresh tokens e middleware de autenticação.",
  status: "IN_PROGRESS",
  priority: "HIGH",
  dueDate: "2025-01-15",
  assignedUsers: [
    { id: "1", username: "João Silva", email: "joao@example.com", avatar: "" },
    { id: "2", username: "Maria Santos", email: "maria@example.com", avatar: "" },
  ],
  createdAt: "2025-01-10T10:00:00Z",
  updatedAt: "2025-01-12T15:30:00Z",
  commentCount: 5,
}

const mockComments: Comment[] = [
  {
    id: "1",
    taskId: "1",
    userId: "1",
    user: { id: "1", username: "João Silva", email: "joao@example.com", avatar: "" },
    content: "Comecei a implementar o sistema de JWT. Estou usando a biblioteca jsonwebtoken.",
    createdAt: "2025-01-10T11:30:00Z",
  },
  {
    id: "2",
    taskId: "1",
    userId: "2",
    user: { id: "2", username: "Maria Santos", email: "maria@example.com", avatar: "" },
    content: "Ótimo! Não esqueça de implementar o refresh token também para melhor segurança.",
    createdAt: "2025-01-10T14:20:00Z",
  },
  {
    id: "3",
    taskId: "1",
    userId: "1",
    user: { id: "1", username: "João Silva", email: "joao@example.com", avatar: "" },
    content: "Sim, já está no planejamento. Vou usar Redis para armazenar os refresh tokens.",
    createdAt: "2025-01-11T09:15:00Z",
  },
  {
    id: "4",
    taskId: "1",
    userId: "3",
    user: { id: "3", username: "Pedro Costa", email: "pedro@example.com", avatar: "" },
    content:
      "Pessoal, lembrem de adicionar rate limiting nas rotas de autenticação para prevenir ataques de força bruta.",
    createdAt: "2025-01-11T16:45:00Z",
  },
  {
    id: "5",
    taskId: "1",
    userId: "2",
    user: { id: "2", username: "Maria Santos", email: "maria@example.com", avatar: "" },
    content: "Boa sugestão Pedro! Vou adicionar isso na lista de requisitos.",
    createdAt: "2025-01-12T10:00:00Z",
  },
]

const mockHistory: TaskHistory[] = [
  {
    id: "1",
    taskId: "1",
    userId: "1",
    user: { id: "1", username: "João Silva", email: "joao@example.com" },
    action: "Alterou o status",
    changes: { status: { from: "TODO", to: "IN_PROGRESS" } },
    createdAt: "2025-01-12T15:30:00Z",
  },
  {
    id: "2",
    taskId: "1",
    userId: "2",
    user: { id: "2", username: "Maria Santos", email: "maria@example.com" },
    action: "Adicionou comentário",
    changes: {},
    createdAt: "2025-01-12T14:20:00Z",
  },
  {
    id: "3",
    taskId: "1",
    userId: "1",
    user: { id: "1", username: "João Silva", email: "joao@example.com" },
    action: "Criou a tarefa",
    changes: {},
    createdAt: "2025-01-10T10:00:00Z",
  },
]

const statusConfig = {
  TODO: { label: "A Fazer", color: "bg-[#6b7280] text-white" },
  IN_PROGRESS: { label: "Em Progresso", color: "bg-[#3b82f6] text-white" },
  REVIEW: { label: "Em Revisão", color: "bg-[#8b5cf6] text-white" },
  DONE: { label: "Concluído", color: "bg-[#10b981] text-white" },
}

const priorityConfig = {
  LOW: { label: "Baixa", color: "bg-[#6b7280] text-white" },
  MEDIUM: { label: "Média", color: "bg-[#3b82f6] text-white" },
  HIGH: { label: "Alta", color: "bg-[#f59e0b] text-white" },
  URGENT: { label: "Urgente", color: "bg-[#ef4444] text-white" },
}

function TaskDetailPage() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const params = useParams({ from: "/tasks/$id" })
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [task, setTask] = useState<Task | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [history, setHistory] = useState<TaskHistory[]>([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" })
      return
    }

    setTimeout(() => {
      setTask(mockTask)
      setComments(mockComments)
      setHistory(mockHistory)
      setIsLoading(false)
    }, 800)
  }, [isAuthenticated, navigate, params.id])

  const handleAddComment = async (content: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newComment: Comment = {
      id: String(comments.length + 1),
      taskId: task!.id,
      userId: user!.id,
      user: user!,
      content,
      createdAt: new Date().toISOString(),
    }

    setComments([...comments, newComment])

    // Update task comment count
    if (task) {
      setTask({ ...task, commentCount: task.commentCount + 1 })
    }
  }

  const handleDelete = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso.",
      })
      navigate({ to: "/tasks" })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-96" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">Tarefa não encontrada</h2>
            <p className="text-muted-foreground mb-4">A tarefa que você procura não existe ou foi removida.</p>
            <Button onClick={() => navigate({ to: "/tasks" })}>Voltar para tarefas</Button>
          </div>
        </main>
      </div>
    )
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/tasks" })} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <span>/</span>
            <span>Tarefas</span>
            <span>/</span>
            <span className="text-foreground">{task.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <h1 className="text-3xl font-bold tracking-tight text-balance">{task.title}</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={cn("text-xs", status.color)}>{status.label}</Badge>
                      <Badge className={cn("text-xs", priority.color)}>{priority.label}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)} className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)} className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Descrição</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {task.description || "Nenhuma descrição fornecida."}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="comments">Comentários ({task.commentCount})</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="space-y-4">
                  <CommentList taskId={task.id} comments={comments} isLoading={false} onAddComment={handleAddComment} />
                </TabsContent>
                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {item.user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {item.id !== history[history.length - 1].id && (
                            <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{item.user.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(item.createdAt), "dd MMM 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.action}</p>
                          {item.changes.status && (
                            <div className="text-xs text-muted-foreground">
                              {statusConfig[item.changes.status.from as keyof typeof statusConfig].label} →{" "}
                              {statusConfig[item.changes.status.to as keyof typeof statusConfig].label}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h3 className="font-semibold">Detalhes</h3>
                <Separator />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Prazo</p>
                      <p className="text-sm text-muted-foreground">
                        {task.dueDate ? format(new Date(task.dueDate), "PPP", { locale: ptBR }) : "Sem prazo definido"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Criada em</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(task.createdAt), "PPP", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Atualizada em</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(task.updatedAt), "PPP", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-medium">Atribuído a</p>
                    </div>
                    <div className="space-y-2">
                      {task.assignedUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.username}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TaskModal open={editModalOpen} onOpenChange={setEditModalOpen} task={task} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A tarefa será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
