import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { RichTask } from "@/services/tasks/interface"

interface TaskCardProps {
  task: RichTask
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

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

export function TaskCard({ task, onClick }: TaskCardProps) {
  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50",
        "group relative overflow-hidden",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "absolute top-0 left-0 w-1 h-full transition-all",
          task.priority === "URGENT" && "bg-[#ef4444]",
          task.priority === "HIGH" && "bg-[#f59e0b]",
          task.priority === "MEDIUM" && "bg-[#3b82f6]",
          task.priority === "LOW" && "bg-[#6b7280]",
        )}
      />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{task.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("text-xs", status.color)}>{status.label}</Badge>
              <Badge className={cn("text-xs", priority.color)}>{priority.label}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      {task.description && (
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        </CardContent>
      )}

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(task.dueDate), "dd MMM", { locale: ptBR })}</span>
            </div>
          )}
        </div>

        <div className="flex items-center -space-x-2">
          {task.assignedUsers.slice(0, 3).map((user) => (
            <Avatar key={user.id} className="h-7 w-7 border-2 border-background">
              <AvatarFallback className="text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ))}
          {task.assignedUsers.length > 3 && (
            <div className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
              +{task.assignedUsers.length - 3}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
