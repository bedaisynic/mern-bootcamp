import { z } from "zod";

export const presignBodySchema = z.object({
  filename: z.string().trim().min(1, "filename is required"),
  contentType: z.string().trim().min(1, "contentType is required"),
});
export type PresignBody = z.infer<typeof presignBodySchema>;
