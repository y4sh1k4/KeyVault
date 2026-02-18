import { z } from "zod";

export const projectSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});