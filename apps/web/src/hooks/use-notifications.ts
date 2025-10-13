import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/store"
import type { Notification } from "@/services/tasks/interface"

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "task_assigned",
    title: "Nova tarefa atribuída",
    message: "Você foi atribuído à tarefa 'Implementar autenticação com JWT'",
    taskId: "1",
    read: false,
    createdAt: "2025-01-12T16:30:00Z",
  },
  {
    id: "2",
    type: "comment_new",
    title: "Novo comentário",
    message: "Maria Santos comentou na tarefa 'Implementar autenticação com JWT'",
    taskId: "1",
    read: false,
    createdAt: "2025-01-12T15:20:00Z",
  },
  {
    id: "3",
    type: "task_updated",
    title: "Tarefa atualizada",
    message: "O status da tarefa 'Criar dashboard de analytics' foi alterado para 'Em Progresso'",
    taskId: "2",
    read: true,
    createdAt: "2025-01-12T10:15:00Z",
  },
  {
    id: "4",
    type: "task_created",
    title: "Nova tarefa criada",
    message: "Uma nova tarefa 'Otimizar queries do banco de dados' foi criada",
    taskId: "4",
    read: true,
    createdAt: "2025-01-11T14:00:00Z",
  },
]

export function useNotifications() {
  const { isAuthenticated, token } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([])
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications)
      setIsLoading(false)
    }, 500)
  }, [isAuthenticated, token])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const addNotification = (notification: Omit<Notification, "id" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  return {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    unreadCount: notifications.filter((n) => !n.read).length,
  }
}
