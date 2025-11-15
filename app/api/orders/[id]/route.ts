import { Prisma, PrismaClient } from "@/app/generated/prisma/client";
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

    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const createdById = (verifiedToken as { id: number }).id;

    const order = await prisma.order.findFirst({
      where: { id: orderId, createdById },
    });

    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    await prisma.material.deleteMany({
      where: { orderId: orderId },
    });

    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete order", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { message: "Invalid request ID" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const orderBody = await request.json();

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const updateData: Prisma.OrderUpdateInput = {};
    if (orderBody.customerName)
      updateData.customerName = orderBody.customerName;
    if (orderBody.progress) updateData.progress = orderBody.progress;
    if (orderBody.dueDate) updateData.dueDate = orderBody.dueDate;
    if (orderBody.status) updateData.status = orderBody.status;
    if (orderBody.acceptedById)
      updateData.acceptedBy = {
        connect: { id: orderBody.acceptedById },
      };

    if (orderBody.materials) {
      updateData.material = {
        deleteMany: {},
        create: orderBody.material.map((item: Prisma.MaterialCreateInput) => ({
          materialName: item.materialName,
          quantity: item.quantity,
        })),
      };
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { material: true },
    });

    return NextResponse.json(
      {
        message: "Order updated successfully",
        request: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/Order error:", error);
    return NextResponse.json(
      { message: "Error updating Order", error },
      { status: 500 }
    );
  }
}
