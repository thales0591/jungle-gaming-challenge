import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { TaskStatus, TaskPriority, TaskSortBy } from "@/services/tasks/interface";

interface TaskFiltersProps {
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: TaskSortBy;
  onStatusChange: (value?: TaskStatus) => void;
  onPriorityChange: (value?: TaskPriority) => void;
  onSortByChange: (value?: TaskSortBy) => void;
  onClearFilters: () => void;
}

export function TaskFilters({
  status,
  priority,
  sortBy,
  onStatusChange,
  onPriorityChange,
  onSortByChange,
  onClearFilters,
}: TaskFiltersProps) {
  const hasActiveFilters = status || priority || sortBy;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={status || "ALL"} onValueChange={(value) => onStatusChange(value === "ALL" ? undefined : value as TaskStatus)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">Todos os status</SelectItem>
          <SelectItem value="TODO">A Fazer</SelectItem>
          <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
          <SelectItem value="REVIEW">Em Revisão</SelectItem>
          <SelectItem value="DONE">Concluído</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priority || "ALL"} onValueChange={(value) => onPriorityChange(value === "ALL" ? undefined : value as TaskPriority)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">Todas prioridades</SelectItem>
          <SelectItem value="LOW">Baixa</SelectItem>
          <SelectItem value="MEDIUM">Média</SelectItem>
          <SelectItem value="HIGH">Alta</SelectItem>
          <SelectItem value="URGENT">Urgente</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy || "DEFAULT"} onValueChange={(value) => onSortByChange(value === "DEFAULT" ? undefined : value as TaskSortBy)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="DEFAULT">Padrão</SelectItem>
          <SelectItem value="newest">Mais recente</SelectItem>
          <SelectItem value="oldest">Mais antiga</SelectItem>
          <SelectItem value="due-date">Prazo mais próximo</SelectItem>
          <SelectItem value="priority">Prioridade</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-1"
        >
          <X className="h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
