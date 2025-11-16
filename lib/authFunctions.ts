import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function tradSignup(req: NextRequest) {
  // get inputs from request body
  const { email, password } = await req.json();

  // validate input
  if (!email) return new NextResponse("Email is required", { status: 400 });
  if (!password)
    return new NextResponse("Password is required", { status: 400 });

  // check if user already exists
  const existingUser = await checkExistingUser(email);
  if (existingUser) {
    return new NextResponse("User already exists", { status: 409 });
  }

  // hash password
  const hashedPsw = await bcrypt.hash(password, 10);

  // create new user
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPsw,
      },
    });

    return NextResponse.json(
      { message: "Signed up successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error signing up user in file:${__filename}`, error },
      { status: 500 }
    );
  }
}

// checks email only
export async function checkExistingUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    return user;
  } catch (error) {
    return NextResponse.json(
      { message: "Error checking user", error },
      { status: 500 }
    );
  }
}
