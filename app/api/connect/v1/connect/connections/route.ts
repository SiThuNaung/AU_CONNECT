// app/api/connect/v1/connect/connections/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 });

  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { userAId: userId },
        { userBId: userId },
      ],
    },
  });

  const friendIds = connections.map(c =>
    c.userAId === userId ? c.userBId : c.userAId
  );

  const users = await prisma.user.findMany({
    where: { id: { in: friendIds } },
    select: {
      id: true,
      username: true,
      title: true,
      profilePic: true,
    },
  });

  return NextResponse.json({ data: users });
}
