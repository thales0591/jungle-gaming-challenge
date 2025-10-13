import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { Header } from "@/components/layout/header";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskSkeleton } from "@/components/tasks/task-skeleton";
import { TaskModal } from "@/components/tasks/task-modal";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import type { RichTask } from "@/services/tasks/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTaskRequest, fetchTasksRequest } from "@/services/tasks";
import type { TaskFormData } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

export const Route = createFileRoute("/tasks/")({
  component: TasksPage,
});

const mockTasks: RichTask[] = [
  {
    id: "1",
    title: "Implementar autenticação com JWT",
    description:
      "Adicionar sistema de autenticação usando JSON Web Tokens para segurança da API",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2025-01-15",
    assignedUsers: [
      { id: "1", name: "João Silva", email: "joao@example.com" },
      { id: "2", name: "Maria Santos", email: "maria@example.com" },
    ],
    author: { id: "1", name: "João Silva", email: "joao@example.com" },
    createdAt: "2025-01-10",
    updatedAt: "2025-01-12",
  },
  {
    id: "2",
    title: "Criar dashboard de analytics",
    description:
      "Desenvolver página de analytics com gráficos e métricas importantes",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "2025-01-20",
    assignedUsers: [
      { id: "3", name: "Pedro Costa", email: "pedro@example.com" },
    ],
    author: { id: "3", name: "Pedro Costa", email: "pedro@example.com" },
    createdAt: "2025-01-11",
    updatedAt: "2025-01-11",
  },
  {
    id: "3",
    title: "Corrigir bug no formulário de cadastro",
    description:
      "Usuários relatam erro ao tentar se cadastrar com emails longos",
    status: "REVIEW",
    priority: "URGENT",
    dueDate: "2025-01-13",
    assignedUsers: [
      { id: "1", name: "João Silva", email: "joao@example.com" },
      { id: "4", name: "Ana Lima", email: "ana@example.com" },
    ],
    author: { id: "1", name: "João Silva", email: "joao@example.com" },
    createdAt: "2025-01-09",
    updatedAt: "2025-01-12",
  },
  {
    id: "4",
    title: "Otimizar queries do banco de dados",
    description: "Melhorar performance das consultas mais utilizadas",
    status: "TODO",
    priority: "LOW",
    assignedUsers: [
      { id: "2", name: "Maria Santos", email: "maria@example.com" },
    ],
    author: { id: "2", name: "Maria Santos", email: "maria@example.com" },
    createdAt: "2025-01-08",
    updatedAt: "2025-01-08",
    dueDate: "2025-01-10",
  },
  {
    id: "5",
    title: "Documentar API REST",
    description: "Criar documentação completa usando Swagger/OpenAPI",
    status: "DONE",
    priority: "MEDIUM",
    dueDate: "2025-01-10",
    assignedUsers: [
      { id: "3", name: "Pedro Costa", email: "pedro@example.com" },
      { id: "4", name: "Ana Lima", email: "ana@example.com" },
      { id: "1", name: "João Silva", email: "joao@example.com" },
    ],
    author: { id: "3", name: "Pedro Costa", email: "pedro@example.com" },
    createdAt: "2025-01-05",
    updatedAt: "2025-01-10",
  },
  {
    id: "6",
    title: "Implementar testes E2E",
    description:
      "Adicionar testes end-to-end usando Playwright para fluxos críticos",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2025-01-18",
    assignedUsers: [{ id: "1", name: "João Silva", email: "joao@example.com" }],
    author: { id: "1", name: "João Silva", email: "joao@example.com" },
    createdAt: "2025-01-07",
    updatedAt: "2025-01-12",
  },
];

function TasksPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<RichTask[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("recent");
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<RichTask | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasksData } = useQuery({
    queryKey: ["tasks"],
    queryFn: () =>
      fetchTasksRequest({
        page: 1,
        size: 20,
      }),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
      return;
    }

    setTimeout(() => {
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);

  const handleClearFilters = () => {
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setSortBy("recent");
    setSearchQuery("");
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsCreateTaskModalOpen(true);
  };

  // const handleEditTask = (task: RichTask) => {
  //   setEditingTask(task);
  //   setTaskModalOpen(true);
  // };

  const createTaskMutatiton = useMutation({
    mutationFn: createTaskRequest,
    onError: () => {
      toast({
        title: "Erro ao criar task",
        description:
          "Ocorreu um erro inesperado, por favor entre em contato com o suporte.",
        variant: "destructive",
      });
    },
  });

  async function handleCreateTask(data: TaskFormData) {
    await createTaskMutatiton.mutateAsync(data);
    toast({
      title: "Tarefa criada com sucesso!",
      description: "As pessoas atribuídas serão notificadas.",
    });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNewTask={handleNewTask}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
              <p className="text-muted-foreground">
                Gerencie e acompanhe suas tarefas
              </p>
            </div>
          </div>

          <TaskFilters
            status={statusFilter}
            priority={priorityFilter}
            sortBy={sortBy}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onSortByChange={setSortBy}
            onClearFilters={handleClearFilters}
          />

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <TaskSkeleton key={i} />
              ))}
            </div>
          ) : tasksData?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ||
                statusFilter !== "ALL" ||
                priorityFilter !== "ALL"
                  ? "Tente ajustar os filtros ou busca"
                  : "Crie sua primeira tarefa para começar"}
              </p>
              <Button onClick={handleClearFilters}>Limpar filtros</Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasksData?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() =>
                      navigate({
                        to: `/tasks/$taskId`,
                        params: { taskId: task.id },
                      })
                    }
                    //onEdit={() => handleEditTask(task)}
                    onDelete={() => console.log("Delete", task.id)}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {tasksData?.length} de {tasks.length} tarefas
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <TaskModal
        open={isCreateTaskModalOpen}
        onOpenChange={setIsCreateTaskModalOpen}
        onSave={handleCreateTask}
      />

      <TaskModal
        open={isEditTaskModalOpen}
        onOpenChange={setIsEditTaskModalOpen}
        task={editingTask}
        //onSave={}
      />
    </div>
  );
}
