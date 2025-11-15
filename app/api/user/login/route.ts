import { PrismaClient } from "@/app/generated/prisma/client";
import { LoginSchema } from "@/lib/dto";
import { loginRequest } from "@/lib/interface";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as loginRequest;

    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const data = validation.data;

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 401 }
        );
      }
    }
    
    const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const JWTSecret = process.env.JWT_SECRET!;

    const token = jwt.sign(jwtPayload, JWTSecret, { expiresIn: "30h" });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json(
      { message: "Login data is valid" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching signup data", detail: String(error) },
      { status: 500 }
    );
  }
}
