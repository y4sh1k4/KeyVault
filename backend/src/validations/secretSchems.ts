import { z } from "zod";

export const secretSchema = z.object({
  key: z.string(),
  Value: z.string(),
});