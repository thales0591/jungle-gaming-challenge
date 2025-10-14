import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { TaskAuditLog } from "@/services/tasks/interface";
import { ArrowRight } from "lucide-react";

interface HistoryListProps {
  auditLogs: TaskAuditLog[];
  isLoading?: boolean;
}

const actionLabels: Record<string, string> = {
  CREATED: "criou a tarefa",
  UPDATED: "atualizou",
  STATUS_CHANGED: "alterou o status",
  PRIORITY_CHANGED: "alterou a prioridade",
  ASSIGNED_USER_ADDED: "adicionou usuário(s)",
  ASSIGNED_USER_REMOVED: "removeu usuário(s)",
  DUE_DATE_CHANGED: "alterou a data de vencimento",
  DELETED: "excluiu a tarefa",
};

const statusLabels: Record<string, string> = {
  TODO: "A Fazer",
  IN_PROGRESS: "Em Progresso",
  REVIEW: "Em Revisão",
  DONE: "Concluído",
};

const priorityLabels: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const fieldLabels: Record<string, string> = {
  title: "Título",
  description: "Descrição",
  status: "Status",
  priority: "Prioridade",
  dueDate: "Data de vencimento",
  assignedUserIds: "Usuários atribuídos",
};

const statusColors: Record<string, string> = {
  TODO: "bg-[#6b7280]",
  IN_PROGRESS: "bg-[#3b82f6]",
  REVIEW: "bg-[#8b5cf6]",
  DONE: "bg-[#10b981]",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-[#6b7280]",
  MEDIUM: "bg-[#3b82f6]",
  HIGH: "bg-[#f59e0b]",
  URGENT: "bg-[#ef4444]",
};

function formatValue(field: string, value: string | null): string {
  if (value === null) return "Nenhum";

  if (field === "status") {
    return statusLabels[value] || value;
  }

  if (field === "priority") {
    return priorityLabels[value] || value;
  }

  if (field === "dueDate") {
    try {
      return format(new Date(value), "dd MMM yyyy", { locale: ptBR });
    } catch {
      return value;
    }
  }

  if (field === "assignedUserIds") {
    const ids = value.split(",").filter(Boolean);
    return `${ids.length} usuário(s)`;
  }

  return value;
}

function isLongText(value: string | null): boolean {
  return value !== null && value.length > 50;
}

export function HistoryList({ auditLogs, isLoading }: HistoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum histórico disponível.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {auditLogs.map((log, index) => (
          <div key={log.id} className="flex gap-4">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {log.userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {index !== auditLogs.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
              )}
            </div>
            <div className="flex-1 space-y-2 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{log.userName}</span>
                <span className="text-xs text-muted-foreground">
                  {actionLabels[log.action] || log.action.toLowerCase()}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(log.createdAt), "dd MMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>

              {log.action !== "CREATED" &&
                log.changes?.changes &&
                log.changes.changes.length > 0 && (
                  <div className="space-y-2">
                    {log.changes.changes.map((change, changeIndex) => {
                      const isTextLong =
                        isLongText(change.oldValue) ||
                        isLongText(change.newValue);
                      const isStatus = change.field === "status";
                      const isPriority = change.field === "priority";

                      return (
                        <div
                          key={changeIndex}
                          className="text-sm bg-muted/50 rounded-md px-3 py-2.5 space-y-2"
                        >
                          <div className="font-medium text-foreground text-xs uppercase tracking-wide">
                            {fieldLabels[change.field] || change.field}
                          </div>

                          {isTextLong ? (
                            <div className="space-y-2">
                              {change.oldValue && (
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground font-medium">
                                    Anterior:
                                  </div>
                                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-foreground/80 line-through decoration-red-500/50">
                                    {change.oldValue}
                                  </div>
                                </div>
                              )}
                              {change.newValue && (
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground font-medium">
                                    Novo:
                                  </div>
                                  <div className="bg-green-500/10 border border-green-500/20 rounded p-2 text-foreground font-medium">
                                    {change.newValue}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : isStatus ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              {change.oldValue && (
                                <Badge
                                  className={`${statusColors[change.oldValue]} text-white opacity-60`}
                                >
                                  {formatValue(change.field, change.oldValue)}
                                </Badge>
                              )}
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              {change.newValue && (
                                <Badge
                                  className={`${statusColors[change.newValue]} text-white`}
                                >
                                  {formatValue(change.field, change.newValue)}
                                </Badge>
                              )}
                            </div>
                          ) : isPriority ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              {change.oldValue && (
                                <Badge
                                  className={`${priorityColors[change.oldValue]} text-white opacity-60`}
                                >
                                  {formatValue(change.field, change.oldValue)}
                                </Badge>
                              )}
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              {change.newValue && (
                                <Badge
                                  className={`${priorityColors[change.newValue]} text-white`}
                                >
                                  {formatValue(change.field, change.newValue)}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-foreground/60 line-through decoration-red-500/50">
                                {formatValue(change.field, change.oldValue)}
                              </span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground font-medium">
                                {formatValue(change.field, change.newValue)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
