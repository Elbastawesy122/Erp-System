import { PrismaClient } from "@/app/generated/prisma/client";
import { SignUpSchema } from "@/lib/dto";
import { SignUpRequest } from "@/lib/interface";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
  try {
    const requestBody = (await request.json()) as SignUpRequest;

    const validation = SignUpSchema.safeParse(requestBody);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const data = validation.data;

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "user already found" },
        { status: 400 }
      );
    }

    const saltRoundes = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRoundes);

    const newuser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        isAdmin: data.isAdmin || false,
      },
    });

    return NextResponse.json(
      { message: "User signed up successfully", newuser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching signup data", detail: String(error) },
      { status: 500 }
    );
  }
}
