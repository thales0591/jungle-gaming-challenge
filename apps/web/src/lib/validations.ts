import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Nome de usuário deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    // .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    // .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .min(10, { message: "Descrição deve ter no mínimo 10 caracteres" })
    .refine(
      (val) => !val || val.trim().length === 0 || val.trim().length >= 10,
      "Descrição deve ter no mínimo 10 caracteres"
    ),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
    required_error: "Prioridade é obrigatória",
  }),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"], {
    required_error: "Status é obrigatório",
  }),
  dueDate: z.string().optional(),
  assignedUserIds: z
    .array(z.string())
    .min(1, { message: "Selecione pelo menos um usuário" }),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comentário não pode estar vazio").max(1000),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
