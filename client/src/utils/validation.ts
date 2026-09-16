
import { z } from "zod";

const phoneRegex = /^(\+?\d{1,4}?[\s-]?)?\(?\d{2,3}?\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
const telegramRegex = /^@[a-zA-Z0-9_]{4,32}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]+$/;

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Ім'я є обов'язковим для заповнення")
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .regex(nameRegex, "Ім'я має складатися лише з літер"),

  contact: z
    .string()
    .min(1, "Вкажіть телефон або Telegram для зв'язку")
    .refine(
      (val) => phoneRegex.test(val.trim()) || telegramRegex.test(val.trim()),
      {
        message: "Введіть коректний номер телефону або Telegram-нік (починаючи з @)",
      }
    ),

  message: z
    .string()
    .max(500, "Повідомлення не може перевищувати 500 символів")
    .optional(),
});


export const resumeSchema = z.object({
  title: z.string().min(2, "Введіть бажану посаду"),
  language: z.string(),
  experience: z.string().min(5, "Опишіть ваш досвід детальніше"),
  phone: z
    .string()
    .min(1, "Введіть номер телефону")
    .regex(phoneRegex, "Введіть коректний номер телефону (наприклад, +380XXXXXXXXX)"),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Введіть електронну пошту").email("Некоректний формат email"),
  password: z.string().min(6, "Пароль має містити мінімум 6 символів"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Введіть електронну пошту").email("Некоректний формат email"),
});

export const registerSchema = z.object({
  email: z.string().min(1, "Введіть електронну пошту").email("Некоректний формат email"),
  password: z
    .string()
    .min(1, "Введіть пароль")
    .regex(
      passwordRegex,
      "Пароль має містити мін. 8 символів, велику/малу літеру, цифру та спецсимвол (@$!%*?&)"
    ),
  confirmPassword: z.string().min(1, "Підтвердіть пароль"),
  role: z.enum(["candidate", "employer"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролі не співпадають",
  path: ["confirmPassword"],
});


export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type ResumeFormValues = z.infer<typeof resumeSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;