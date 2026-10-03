import { z } from "zod";

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
const ACCEPTED_ATTACHMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "image/jpeg",
  "image/png",
];

export const createAssignmentZodSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(150, "Title must be at most 150 characters long"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long"),
  budget: z
    .number("Budget is required")
    .positive("Budget must be greater than 0"),
  deadline: z
    .date("Deadline is required")
    .refine(
      (date) => date.getTime() > Date.now(),
      "Deadline must be in the future",
    ),
  attachment: z
    .array(z.instanceof(File))
    .max(1, "Only one attachment is allowed")
    .refine(
      (files) => files.every((file) => file.size <= MAX_ATTACHMENT_SIZE),
      "Attachment must be 10MB or smaller",
    )
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_ATTACHMENT_TYPES.includes(file.type)),
      "Only PDF, DOC, DOCX, ZIP, JPG or PNG files are allowed",
    ),
});

export const placeBidZodSchema = z.object({
  proposedAmount: z
    .number("Proposed amount is required")
    .positive("Proposed amount must be greater than 0"),
  estimatedDelivery: z
    .date("Estimated delivery is required")
    .refine(
      (date) => date.getTime() > Date.now(),
      "Estimated delivery must be in the future",
    ),
  coverNote: z
    .string()
    .trim()
    .min(20, "Cover note must be at least 20 characters long")
    .max(2000, "Cover note must be at most 2000 characters long"),
});

export const submitWorkZodSchema = z.object({
  status: z.enum(["SUBMITTED"], "Status is required"),
  attachment: z
    .array(z.instanceof(File))
    .min(1, "Please attach your deliverable")
    .max(1, "Only one attachment is allowed")
    .refine(
      (files) => files.every((file) => file.size <= MAX_ATTACHMENT_SIZE),
      "Attachment must be 10MB or smaller",
    )
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_ATTACHMENT_TYPES.includes(file.type)),
      "Only PDF, DOC, DOCX, ZIP, JPG or PNG files are allowed",
    ),
});

export const rejectSubmissionZodSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(20, "Reason must be at least 20 characters long")
    .max(1000, "Reason must be at most 1000 characters long"),
});
