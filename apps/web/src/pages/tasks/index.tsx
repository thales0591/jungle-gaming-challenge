import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { Header } from "@/components/layout/header";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskSkeleton } from "@/components/tasks/task-skeleton";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTasksRequest } from "@/services/tasks";

export const Route = createFileRoute("/tasks/")({
  component: TasksPage,
});

function TasksPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
    </div>
  );
}
