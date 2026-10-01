import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerZodSchema = z
  .object({
    name: z.string().min(3, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const studentVerifyZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "otp must be 6 characters long"),
});

export const expertVerifyZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "otp must be 6 characters long"),
});

/** {
  "email": "{{expertEmail}}",
  "otp": "670643",
  "university": "University of Dhaka",
  "department": "Computer Science",
  "ratePerAssignment": 1500,
  "bio": "5 years of tutoring experience in algorithms and databases."
} */
