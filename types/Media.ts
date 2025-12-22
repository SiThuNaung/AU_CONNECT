
export type MediaType = "image" | "video" | "file";

export type MediaItem = {
  id: string;
  file: File;
  previewUrl: string | undefined;
  type: MediaType;
};