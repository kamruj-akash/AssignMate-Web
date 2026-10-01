import { z } from "zod";

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

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

export const expertVerifyZodSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "otp must be 6 characters long"),
    university: z.string().min(3, "University is required"),
    department: z.string().min(3, "Department is required"),
    ratePerAssignment: z
      .number()
      .min(100, "Rate per assignment must be at least 100"),
    bio: z.string().min(10, "Bio must be at least 10 characters long"),
    documents: z
      .array(z.instanceof(File))
      .min(1, "Please upload at least one document")
      .max(5, "You can upload up to 5 documents")
      .refine(
        (files) => files.every((file) => file.size <= MAX_DOCUMENT_SIZE),
        "Each file must be 5MB or smaller",
      )
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type)),
        "Only PDF, JPG or PNG files are allowed",
      ),
  });


/**{
  "otp": "111111",
  "email": "nywomykola@mailinator.com",
  "university": "Eius fugit natus co",
  "department": "In suscipit sit fac",
  "ratePerAssignment": 27,
  "bio": "Adipisicing sequi qu"
} */
