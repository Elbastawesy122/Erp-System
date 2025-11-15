import { PrismaClient } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/verificationtoken";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const verifiedToken = verifyToken(token);
    if (!verifiedToken)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const requestData = await prisma.request.findUnique({
      where: { id: Number(id) },
      include: { materials: true },
    });

    if (!requestData)
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );

    for (const m of requestData.materials) {
      const storeItem = await prisma.store.findUnique({
        where: { name: m.materialName },
      });

      if (!storeItem) {
        return NextResponse.json(
          { message: `Not enough ${m.materialName} in stock` },
          { status: 400 }
        );
      }

      if (storeItem) {
        await prisma.store.update({
          where: { id: storeItem.id },
          data: { quantity: { increment: m.quantity } },
        });
      }
    }

    await prisma.request.update({
      where: { id: Number(id) },
      data: { status: "Approved" },
    });

    return NextResponse.json({ message: "Request approved successfully" });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
