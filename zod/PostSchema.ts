import { z } from "zod";

import { MediaSchema } from "./MediaSchema";

export const CreatePostSchema = z.object({
  postType: z.enum(["media", "article", "poll", "opportunity"]),
  visibility: z.enum(["everyone", "friends", "only-me"]).optional(),
  title: z.string().optional(),
  content: z.string(),
  commentsDisabled: z.boolean(),

  // Poll-specific fields
  pollOptions: z.array(z.string()).optional(),
  pollDuration: z.number().optional(), // duration in days
  media: z.array(MediaSchema).optional(),
});

export const EditPostSchema = z.object({
  postType: z.enum(["media", "article", "poll", "opportunity"]),
  title: z.string().optional(),
  content: z.string().optional(),
  visibility: z.enum(["everyone", "friends", "only-me"]).optional(),
  commentsDisabled: z.boolean(),
  media: z.array(MediaSchema).optional(),

  // Poll-specific fields
  pollOptions: z.array(z.string()).optional(),
  pollDuration: z.number().optional(),
});
