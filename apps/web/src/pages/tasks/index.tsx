import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { Header } from "@/components/layout/header";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskSkeleton } from "@/components/tasks/task-skeleton";
import { TaskModal } from "@/components/tasks/task-modal";
import { AlertCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTaskRequest, fetchTasksRequest } from "@/services/tasks";
import type { TaskFormData } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

export const Route = createFileRoute("/tasks/")({
  component: TasksPage,
});

function TasksPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
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
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);

  const handleNewTask = () => {
    setIsCreateTaskModalOpen(true);
  };

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
                  Mostrando {tasksData?.length} de {tasksData?.length} tarefas
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
    </div>
  );
}
