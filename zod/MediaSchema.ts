import { z } from "zod";

const MediaSchema = z.object({
  blobName: z.string(),
  thumbnailBlobName: z.string().optional(),
  type: z.enum(["image", "video", "file"]),
  name: z.string(),
  mimetype: z.string().optional(),
  size: z.number().optional(),
});

export default MediaSchema;
