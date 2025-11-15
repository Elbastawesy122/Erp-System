import { PrismaClient } from "@/app/generated/prisma/client";
import { verifyToken } from "@/lib/verificationtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const verifiedToken = verifyToken(token);
    if (!verifiedToken) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: verifiedToken.id },
      include: {
        ordersAccepted: { include: { material: true } },
      },
    });

    return NextResponse.json({
      message: "Store API is working!",
      user,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching store data", error }, { status: 500 });
  }
}
