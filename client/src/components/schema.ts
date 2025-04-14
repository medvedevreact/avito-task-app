import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Название должно содержать минимум 3 символа")
    .refine(
      (value) => value.length > 0,
      "Название не может состоять только из пробелов"
    ),
  description: z
    .string()
    .trim()
    .min(10, "Описание должно содержать минимум 10 символов")
    .refine(
      (value) => value.length > 0,
      "Описание не может состоять только из пробелов"
    ),
  projectId: z.string().min(1, "Выберите проект"),
  priority: z.string().min(1, "Выберите приоритет"),
  status: z.string().min(1, "Выберите статус"),
  assigneeId: z.string().min(1, "Выберите исполнителя"),
});

export type TaskFormData = z.infer<typeof taskSchema>;
