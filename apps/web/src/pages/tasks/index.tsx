import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { Header } from "@/components/layout/header";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskSkeleton } from "@/components/tasks/task-skeleton";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTasksRequest } from "@/services/tasks";
import { TaskFilters } from "@/components/tasks/task-filters";
import { Pagination } from "@/components/pagination";
import { z } from "zod";

const tasksSearchSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  sortBy: z.enum(["newest", "oldest", "due-date", "priority"]).optional(),
  page: z.number().optional().default(1),
  size: z.number().optional().default(6),
});

export const Route = createFileRoute("/tasks/")({
  component: TasksPage,
  validateSearch: tasksSearchSchema,
});

function TasksPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const search = useSearch({ from: "/tasks/" });
  const [isLoading, setIsLoading] = useState(false);

  const currentPage = search.page || 1;
  const pageSize = search.size || 6;

  const { data: tasksData } = useQuery({
    queryKey: ["tasks", search.status, search.priority, search.sortBy, currentPage, pageSize],
    queryFn: () =>
      fetchTasksRequest({
        page: currentPage,
        size: pageSize,
        status: search.status,
        priority: search.priority,
        sortBy: search.sortBy,
      }),
  });

  // Fazer uma query extra para verificar se existe próxima página
  const { data: nextPageData } = useQuery({
    queryKey: ["tasks-next", search.status, search.priority, search.sortBy, currentPage + 1, pageSize],
    queryFn: () =>
      fetchTasksRequest({
        page: currentPage + 1,
        size: pageSize,
        status: search.status,
        priority: search.priority,
        sortBy: search.sortBy,
      }),
  });

  const hasNextPage = nextPageData && nextPageData.length > 0;

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

          <TaskFilters
            status={search.status}
            priority={search.priority}
            sortBy={search.sortBy}
            onStatusChange={(status) => {
              navigate({
                to: "/tasks",
                search: { ...search, status, page: 1 },
              });
            }}
            onPriorityChange={(priority) => {
              navigate({
                to: "/tasks",
                search: { ...search, priority, page: 1 },
              });
            }}
            onSortByChange={(sortBy) => {
              navigate({
                to: "/tasks",
                search: { ...search, sortBy, page: 1 },
              });
            }}
            onClearFilters={() => {
              navigate({
                to: "/tasks",
                search: { page: 1, size: pageSize },
              });
            }}
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

              <Pagination
                pageIndex={currentPage}
                hasNextPage={hasNextPage!}
                onPageChange={(newPage) => {
                  navigate({
                    to: "/tasks",
                    search: { ...search, page: newPage },
                  });
                }}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
