import { MEDIA_UPLOAD_API_PATH } from "@/lib/constants";


export async function uploadFile(file: File) {
  try {
    // get SAS token to upload directly
    const res = await fetch(MEDIA_UPLOAD_API_PATH, { method: "POST" });
    const { uploadUrl, publicUrl } = await res.json();

    // upload directly to Azure
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      body: file,
    });

    return publicUrl;
  } catch (e) {
    console.log(
      e instanceof Error
        ? e.message
        : "Client error occured while uploading image"
    );
  }
}
