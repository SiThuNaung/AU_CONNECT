import { MEDIA_UPLOAD_API_PATH } from "@/lib/constants";

export async function uploadFile(file: File) {
  // 1. Ask your server for a SAS upload URL
  const res = await fetch(MEDIA_UPLOAD_API_PATH, {
    method: "POST",
  });

  const { uploadUrl, publicUrl } = await res.json();

  if (!uploadUrl) {
    throw new Error("No upload URL returned");
  }

  // 2. Upload DIRECTLY to Azure
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Azure upload failed");
  }

  // 3. Return the permanent URL
  return publicUrl;
}