import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { taskSchema, type TaskFormData } from "@/lib/validations";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { RichTask } from "@/services/tasks/interface";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "@/services/users";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: RichTask | null;
  onSave?: (data: TaskFormData) => Promise<void>;
}

export function TaskModal({
  open,
  onOpenChange,
  task,
  onSave,
}: TaskModalProps) {
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const isEditing = !!task;

  const { data: usersData } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () =>
      fetchAllUsers(),
  });

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      dueDate: undefined,
      assignedUserIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (task) {
        form.reset({
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          assignedUserIds: task.assignedUsers.map((u) => u.id),
        });
        if (task.dueDate) {
          setDate(new Date(task.dueDate));
        }
      } else {
        form.reset({
          title: "",
          description: "",
          priority: "MEDIUM",
          status: "TODO",
          dueDate: undefined,
          assignedUserIds: [],
        });
        setDate(undefined);
      }
    }
  }, [open, task, form]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      await onSave?.(data);
      toast({
        title: isEditing ? "Tarefa atualizada" : "Tarefa criada",
        description: isEditing
          ? "As alterações foram salvas com sucesso."
          : "A tarefa foi criada com sucesso.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da tarefa."
              : "Preencha os detalhes da nova tarefa."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Digite o título da tarefa"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva a tarefa (máximo 500 caracteres)"
              rows={4}
              maxLength={500}
              className="max-h-40"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {form.watch("description")?.length || 0}/500 caracteres
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">
                Prioridade <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(value) =>
                  form.setValue("priority", value as any)
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.priority && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.priority.message}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) =>
                    form.setValue("status", value as any)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">A Fazer</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                    <SelectItem value="REVIEW">Em Revisão</SelectItem>
                    <SelectItem value="DONE">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Prazo</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "hover:text-white w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date
                    ? format(date, "PPP", { locale: ptBR })
                    : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    form.setValue(
                      "dueDate",
                      newDate ? newDate.toISOString() : undefined
                    );
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
          <Label>Atribuir a</Label>

          {/* Badges dos usuários selecionados */}
          {form.watch("assignedUserIds").length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
              {form.watch("assignedUserIds").map((userId) => {
                const user = usersData?.find((u) => u.id === userId);
                return user ? (
                  <Badge key={userId} variant="secondary" className="gap-1">
                    {user.name}
                    <button
                      type="button"
                      onClick={() => {
                        const currentIds = form.watch("assignedUserIds");
                        form.setValue(
                          "assignedUserIds",
                          currentIds.filter((id) => id !== userId),
                          { shouldValidate: true }
                        );
                      }}
                      className="ml-1 hover:bg-destructive/20 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          {/* Lista de usuários com checkboxes */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={!usersData || usersData.length === 0}
              >
                {!usersData
                  ? "Carregando usuários..."
                  : usersData.length === 0
                  ? "Nenhum usuário disponível"
                  : form.watch("assignedUserIds").length === 0
                  ? "Selecione os usuários"
                  : `${form.watch("assignedUserIds").length} usuário(s) selecionado(s)`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="max-h-60 overflow-y-auto p-2">
                {usersData && usersData.length > 0 ? (
                  <div className="space-y-2">
                    {usersData.map((user) => {
                      const isSelected = form
                        .watch("assignedUserIds")
                        .includes(user.id);
                      return (
                        <div
                          key={user.id}
                          className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => {
                            const currentIds = form.watch("assignedUserIds");
                            if (isSelected) {
                              form.setValue(
                                "assignedUserIds",
                                currentIds.filter((id) => id !== user.id),
                                { shouldValidate: true }
                              );
                            } else {
                              form.setValue("assignedUserIds", [
                                ...currentIds,
                                user.id,
                              ], { shouldValidate: true });
                            }
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => {}}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-2">
                    Nenhum usuário disponível
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {form.formState.errors.assignedUserIds && (
            <p className="text-sm text-destructive">
              {form.formState.errors.assignedUserIds.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {!usersData
              ? "Carregando lista de usuários..."
              : usersData.length === 0
              ? "Nenhum usuário disponível no momento"
              : "Selecione um ou mais usuários para atribuir esta tarefa"}
          </p>
        </div>          

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Salvar alterações" : "Criar tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
