import { z } from "zod";

export const loginZodSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password.length >= 6, {
    message: "Password must be at least 6 characters long",
  });
