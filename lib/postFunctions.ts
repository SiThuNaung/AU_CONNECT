import { NextResponse, NextRequest } from "next/server";
import prisma from "./prisma";

import { getHeaderUserInfo } from "./authFunctions";
import { CreatePostSchema } from "@/zod/PostSchema";
import { log } from "console";

export async function createPost(req: NextRequest) {
  try {
    const [userEmail, userId] = getHeaderUserInfo(req);

    if (!userEmail || !userId) {
      return NextResponse.json(
        { error: "Unauthorized action please sign in again" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // parsing body with zod
    const parsed = CreatePostSchema.safeParse(body);

    if (!parsed.success) {
      console.error("ZOD ERROR:", parsed.error.flatten());
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        email: userEmail,
      },
      select: { username: true, profilePic: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Problem fetching user data to create post" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        userId,
        username: user.username,
        profilePic: user.profilePic ?? "",
        ...data, // title, content, media
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function getPosts(req: NextRequest) {
  try {
    log("getpost function is being called");

    const [userEmail, userId] = getHeaderUserInfo(req);

    if (!userEmail || !userId) {
      return NextResponse.json(
        { error: "Unauthorized action please sign in again" },
        { status: 401 }
      );
    }

    log("STEP 1");

    const cursor = req.nextUrl.searchParams.get("cursor");
    log("cursor: " + cursor);

    log("STEP 2");

    const posts = await prisma.post.findMany({
      take: 10,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { createdAt: "desc" },
    });

    log("STEP 3");

    return NextResponse.json({
      posts,
      nextCursor: posts.length ? posts[posts.length - 1].id : null,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error; fetching post" },
      { status: 500 }
    );
  }
}
