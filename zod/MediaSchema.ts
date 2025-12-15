import { z } from 'zod'

const MediaSchema = z.object({
  url: z.string().refine((v) => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  }),
  type: z.enum(["image", "video", "file"]),
  name: z.string(),
  mimetype: z.string().optional(),
  size: z.number().optional(),
});

export default MediaSchema