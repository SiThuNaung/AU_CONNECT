import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getHeaderUserInfo } from "@/lib/authFunctions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string; applicationId: string }> },
) {
  try {
    const [userEmail, userId] = getHeaderUserInfo(req);
    if (!userEmail || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, applicationId } = await context.params;
    console.log(`postId: ${postId}, applicationId: ${applicationId}`);

    // Verify ownership
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post || post.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log("TEST 1");
    // Fetch application with applicant details
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        jobPost: {
          select: {
            id: true,
            postId: true,
          },
        },
        applicant: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
            title: true,
            location: true,
            phoneNo: true,
            phonePublic: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    if (!application || application.jobPost.postId !== postId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.log("TEST 2");

    // Generate SAS URL for resume
    const credential = new StorageSharedKeyCredential(
      process.env.AZURE_STORAGE_ACCOUNT_NAME!,
      process.env.AZURE_STORAGE_ACCOUNT_KEY!,
    );

    const blobServiceClient = new BlobServiceClient(
      `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      credential,
    );

    const containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER_NAME!,
    );

    const blobClient = containerClient.getBlobClient(
      application.resumeBlobName,
    );

    console.log("TEST 3");
    // Generate SAS token (valid for 1 hour)
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME!,
        blobName: application.resumeBlobName,
        permissions: BlobSASPermissions.parse("r"), // read only
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
      },
      credential,
    ).toString();

    const resumeUrl = `${blobClient.url}?${sasToken}`;
    console.log("TEST 4");

    return NextResponse.json({
      ...application,
      resumeUrl,
    });
  } catch (err) {
    console.error("Error fetching application:", err);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ postId: string; applicationId: string }> },
) {
  try {
    const [userEmail, userId] = getHeaderUserInfo(req);
    if (!userEmail || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, applicationId } = await context.params;
    const { status } = await req.json();

    if (!["APPLIED", "SHORTLISTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Verify ownership
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post || post.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update application status
    const updated = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating application:", err);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}
