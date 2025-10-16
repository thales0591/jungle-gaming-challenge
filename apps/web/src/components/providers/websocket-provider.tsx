import { createContext, useContext, type ReactNode } from "react";
import { useWebSocket, type WebSocketEvent } from "@/lib/websocket";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { notificationsKeys } from "@/hooks/queries/use-notifications-query";

interface WebSocketContextType {
  send: (event: string, data: any) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMessage = async (event: WebSocketEvent) => {
    const message = JSON.parse(event.data);
    switch (event.type) {
      case "task:created":
        toast({
          title: "Nova tarefa criada",
          description: `A tarefa "${message.title}" foi criada e atribuída a você.`,
        });
        await queryClient.invalidateQueries({
          queryKey: notificationsKeys.all,
        });
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
        break;

      case "task:updated":
        toast({
          title: "Tarefa atualizada",
          description: `A tarefa "${message.title}" foi atualizada.`,
        });
        await queryClient.invalidateQueries({
          queryKey: notificationsKeys.all,
        });
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
        await queryClient.refetchQueries({ queryKey: ["task", message.id] });
        break;

      case "comment:new":
        toast({
          title: "Novo comentário",
          description: `${message.user.name} comentou na tarefa "${message.taskTitle}"`,
        });
        await queryClient.invalidateQueries({
          queryKey: notificationsKeys.all,
        });
        await queryClient.invalidateQueries({
          queryKey: ["task", message.taskId, "comments"],
        });
        break;
    }
  };

  const { send, isConnected } = useWebSocket(handleMessage);

  return (
    <WebSocketContext.Provider value={{ send, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within WebSocketProvider"
    );
  }
  return context;
}
