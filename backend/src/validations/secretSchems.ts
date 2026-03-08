import { z } from "zod";

export const secretSchema = z.object({
  key: z.string(),
  value: z.string(),
});