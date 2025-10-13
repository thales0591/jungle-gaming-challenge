import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react"
import { useAuthStore } from "@/lib/store"
import { Header } from "@/components/layout/header"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskSkeleton } from "@/components/tasks/task-skeleton"
import { TaskModal } from "@/components/tasks/task-modal"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import type { Task } from "@/types"
import { useQuery } from "@tanstack/react-query";
import { fetchTasksRequest } from "@/services/tasks";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Implementar autenticação com JWT",
    description: "Adicionar sistema de autenticação usando JSON Web Tokens para segurança da API",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2025-01-15",
    assignedUsers: [
      { id: "1", username: "João Silva", email: "joao@example.com", avatar: "" },
      { id: "2", username: "Maria Santos", email: "maria@example.com", avatar: "" },
    ],
    createdAt: "2025-01-10",
    updatedAt: "2025-01-12",
    commentCount: 5,
  },
  {
    id: "2",
    title: "Criar dashboard de analytics",
    description: "Desenvolver página de analytics com gráficos e métricas importantes",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "2025-01-20",
    assignedUsers: [{ id: "3", username: "Pedro Costa", email: "pedro@example.com", avatar: "" }],
    createdAt: "2025-01-11",
    updatedAt: "2025-01-11",
    commentCount: 2,
  },
  {
    id: "3",
    title: "Corrigir bug no formulário de cadastro",
    description: "Usuários relatam erro ao tentar se cadastrar com emails longos",
    status: "REVIEW",
    priority: "URGENT",
    dueDate: "2025-01-13",
    assignedUsers: [
      { id: "1", username: "João Silva", email: "joao@example.com", avatar: "" },
      { id: "4", username: "Ana Lima", email: "ana@example.com", avatar: "" },
    ],
    createdAt: "2025-01-09",
    updatedAt: "2025-01-12",
    commentCount: 8,
  },
  {
    id: "4",
    title: "Otimizar queries do banco de dados",
    description: "Melhorar performance das consultas mais utilizadas",
    status: "TODO",
    priority: "LOW",
    assignedUsers: [{ id: "2", username: "Maria Santos", email: "maria@example.com", avatar: "" }],
    createdAt: "2025-01-08",
    updatedAt: "2025-01-08",
    commentCount: 1,
  },
  {
    id: "5",
    title: "Documentar API REST",
    description: "Criar documentação completa usando Swagger/OpenAPI",
    status: "DONE",
    priority: "MEDIUM",
    dueDate: "2025-01-10",
    assignedUsers: [
      { id: "3", username: "Pedro Costa", email: "pedro@example.com", avatar: "" },
      { id: "4", username: "Ana Lima", email: "ana@example.com", avatar: "" },
      { id: "1", username: "João Silva", email: "joao@example.com", avatar: "" },
    ],
    createdAt: "2025-01-05",
    updatedAt: "2025-01-10",
    commentCount: 12,
  },
  {
    id: "6",
    title: "Implementar testes E2E",
    description: "Adicionar testes end-to-end usando Playwright para fluxos críticos",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2025-01-18",
    assignedUsers: [{ id: "1", username: "João Silva", email: "joao@example.com", avatar: "" }],
    createdAt: "2025-01-07",
    updatedAt: "2025-01-12",
    commentCount: 3,
  },
]

function TasksPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("recent")
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const { data: tasksData } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => fetchTasksRequest({
      page: 1,
      size: 20
    }),
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" })
      return
    }

    setTimeout(() => {
      setTasks(mockTasks)
      setIsLoading(false)
    }, 1000)
  }, [isAuthenticated, navigate])

  const handleClearFilters = () => {
    setStatusFilter("ALL")
    setPriorityFilter("ALL")
    setSortBy("recent")
    setSearchQuery("")
  }

  const handleNewTask = () => {
    setEditingTask(null)
    setTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskModalOpen(true)
  }

  if (!isAuthenticated) {
    return null
  }

  console.log('data: ', tasksData)

  return (
    <div className="min-h-screen bg-background">
      <Header onNewTask={handleNewTask} onSearch={setSearchQuery} searchQuery={searchQuery} />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
              <p className="text-muted-foreground">Gerencie e acompanhe suas tarefas</p>
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
              <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL"
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
                    onClick={() => navigate({ to: `/tasks/$id`, params: { id: task.id } })}
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

      <TaskModal open={taskModalOpen} onOpenChange={setTaskModalOpen} task={editingTask} />
    </div>
  )
}
