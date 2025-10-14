import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { TaskModal } from "@/components/tasks/task-modal";
import { CommentList } from "@/components/tasks/comment-list";
import { ArrowLeft, Calendar, Pencil, Trash2, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type {
  UserReadModel,
} from "@/services/tasks/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSingleTaskRequest,
  fetchTasksComments,
  updateTaskRequest,
} from "@/services/tasks";
import type { TaskFormData } from "@/lib/validations";

export const Route = createFileRoute("/tasks/$taskId/")({
  component: TaskDetailPage,
});

// Mock history data - TODO: Fetch from API
interface TaskHistory {
  id: string;
  taskId: string;
  userId: string;
  user: UserReadModel;
  action: string;
  changes: Record<string, any>;
  createdAt: string;
}

const mockHistory: TaskHistory[] = [
  {
    id: "1",
    taskId: "1",
    userId: "1",
    user: { id: "1", name: "João Silva", email: "joao@example.com" },
    action: "Alterou o status",
    changes: { status: { from: "TODO", to: "IN_PROGRESS" } },
    createdAt: "2025-01-12T15:30:00Z",
  },
  {
    id: "2",
    taskId: "1",
    userId: "2",
    user: { id: "2", name: "Maria Santos", email: "maria@example.com" },
    action: "Adicionou comentário",
    changes: {},
    createdAt: "2025-01-12T14:20:00Z",
  },
  {
    id: "3",
    taskId: "1",
    userId: "1",
    user: { id: "1", name: "João Silva", email: "joao@example.com" },
    action: "Criou a tarefa",
    changes: {},
    createdAt: "2025-01-10T10:00:00Z",
  },
];

const statusConfig = {
  TODO: { label: "A Fazer", color: "bg-[#6b7280] text-white" },
  IN_PROGRESS: { label: "Em Progresso", color: "bg-[#3b82f6] text-white" },
  REVIEW: { label: "Em Revisão", color: "bg-[#8b5cf6] text-white" },
  DONE: { label: "Concluído", color: "bg-[#10b981] text-white" },
};

const priorityConfig = {
  LOW: { label: "Baixa", color: "bg-[#6b7280] text-white" },
  MEDIUM: { label: "Média", color: "bg-[#3b82f6] text-white" },
  HIGH: { label: "Alta", color: "bg-[#f59e0b] text-white" },
  URGENT: { label: "Urgente", color: "bg-[#ef4444] text-white" },
};

function TaskDetailPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const params = useParams({ from: "/tasks/$taskId/" });
  const { toast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: taskData, isLoading: isLoadingTask } = useQuery({
    queryKey: ["task", params.taskId],
    queryFn: () => fetchSingleTaskRequest(params.taskId),
    enabled: !!params.taskId && isAuthenticated,
  });

  const { data: taskCommentsData = [], isLoading: isLoadingComments } =
    useQuery({
      queryKey: ["task", params.taskId, "comments"],
      queryFn: () => fetchTasksComments(params.taskId),
      enabled: !!params.taskId && isAuthenticated,
    });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  const handleAddComment = async (_content: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A adição de comentários será implementada em breve.",
    });
  };

  const handleDelete = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso.",
      });
      navigate({ to: "/tasks" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
        variant: "destructive",
      });
    }
  };

  const updateTaskMutation = useMutation({
    mutationFn: updateTaskRequest,
    onError: () => {
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Ocorreu um erro inesperado, por favor, entre em contato com o suporte",
        variant: "destructive",
      });
    },
  });

  async function handleEditTask(data: TaskFormData) {
    console.log('upddata: ', JSON.stringify(data))
    if (!taskData) return
    await updateTaskMutation.mutateAsync({
      taskId: taskData.id,
      requestData: data
    });
    toast({
      title: "Sucesso",
      description: "A tarefa foi atualizada.",
    });
    queryClient.invalidateQueries({ queryKey: ["task", params.taskId] });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoadingTask) {
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
    );
  }

  if (!taskData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">Tarefa não encontrada</h2>
            <p className="text-muted-foreground mb-4">
              A tarefa que você procura não existe ou foi removida.
            </p>
            <Button onClick={() => navigate({ to: "/tasks" })}>
              Voltar para tarefas
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const status = statusConfig[taskData.status];
  const priority = priorityConfig[taskData.priority];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/tasks" })}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <span>/</span>
            <span>Tarefas</span>
            <span>/</span>
            <span className="text-foreground">{taskData.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <h1 className="text-3xl font-bold tracking-tight text-balance">
                      {taskData.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={cn("text-xs", status.color)}>
                        {status.label}
                      </Badge>
                      <Badge className={cn("text-xs", priority.color)}>
                        {priority.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditModalOpen(true)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteDialogOpen(true)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Descrição</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {taskData.description || "Nenhuma descrição fornecida."}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="comments">
                    Comentários ({taskCommentsData.length})
                  </TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="space-y-4">
                  <CommentList
                    taskId={taskData.id}
                    comments={taskCommentsData}
                    isLoading={isLoadingComments}
                    onAddComment={handleAddComment}
                  />
                </TabsContent>
                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-4">
                    {mockHistory.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {item.user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {item.id !==
                            mockHistory[mockHistory.length - 1].id && (
                            <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {item.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(
                                new Date(item.createdAt),
                                "dd MMM 'às' HH:mm",
                                { locale: ptBR }
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.action}
                          </p>
                          {item.changes.status && (
                            <div className="text-xs text-muted-foreground">
                              {
                                statusConfig[
                                  item.changes.status
                                    .from as keyof typeof statusConfig
                                ].label
                              }{" "}
                              →{" "}
                              {
                                statusConfig[
                                  item.changes.status
                                    .to as keyof typeof statusConfig
                                ].label
                              }
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
                        {taskData.dueDate
                          ? format(new Date(taskData.dueDate), "PPP", {
                              locale: ptBR,
                            })
                          : "Sem prazo definido"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Criada em</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(taskData.createdAt), "PPP", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Atualizada em</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(taskData.updatedAt), "PPP", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-medium">Atribuído a</p>
                    </div>
                    <div className="space-y-4">
                      {taskData.assignedUsers.map((assignedUser) => (
                        <div
                          key={assignedUser.id}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {assignedUser.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {assignedUser.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {assignedUser.email}
                            </p>
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

      <TaskModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        task={taskData}
        onSave={handleEditTask}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A tarefa será permanentemente
              excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
