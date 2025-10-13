import { createContext, useContext, type ReactNode } from "react"
import { useWebSocket, type WebSocketEvent } from "@/lib/websocket"
import { useNotifications } from "@/hooks/use-notifications"
import { useToast } from "@/hooks/use-toast"

interface WebSocketContextType {
  send: (data: any) => void
  isConnected: boolean
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { addNotification } = useNotifications()
  const { toast } = useToast()

  const handleMessage = (event: WebSocketEvent) => {
    switch (event.type) {
      case "task:created":
        toast({
          title: "Nova tarefa criada",
          description: `A tarefa "${event.data.title}" foi criada.`,
        })
        addNotification({
          type: "task_created",
          title: "Nova tarefa criada",
          message: `A tarefa "${event.data.title}" foi criada`,
          taskId: event.data.id,
          read: false,
        })
        break

      case "task:updated":
        toast({
          title: "Tarefa atualizada",
          description: `A tarefa "${event.data.title}" foi atualizada.`,
        })
        addNotification({
          type: "task_updated",
          title: "Tarefa atualizada",
          message: `A tarefa "${event.data.title}" foi atualizada`,
          taskId: event.data.id,
          read: false,
        })
        break

      case "comment:new":
        toast({
          title: "Novo comentário",
          description: `${event.data.user.username} comentou em uma tarefa.`,
        })
        addNotification({
          type: "comment_new",
          title: "Novo comentário",
          message: `${event.data.user.username} comentou na tarefa "${event.data.taskTitle}"`,
          taskId: event.data.taskId,
          read: false,
        })
        break

      case "notification:new":
        addNotification(event.data)
        break
    }
  }

  const { send, isConnected } = useWebSocket(handleMessage)

  return <WebSocketContext.Provider value={{ send, isConnected }}>{children}</WebSocketContext.Provider>
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocketContext must be used within WebSocketProvider")
  }
  return context
}
