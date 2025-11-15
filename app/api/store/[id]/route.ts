import { PrismaClient } from "@/app/generated/prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/verificationtoken";

const prisma = new PrismaClient();

export async function DELETE(
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

    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.store.findUnique({
      where: { id: productId },
    });

    if (!product)
      return NextResponse.json({ message: "product not found" }, { status: 404 });

    await prisma.material.deleteMany({
      where: { storeId: productId },
    });

    await prisma.store.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      { message: "product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete product", error },
      { status: 500 }
    );
  }
}
