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

    const requestId = parseInt(id);
    if (isNaN(requestId)) {
      return NextResponse.json(
        { message: "Invalid request ID" },
        { status: 400 }
      );
    }

    const createdById = (verifiedToken as { id: number }).id;

    const requests = await prisma.request.findFirst({
      where: { id: requestId, createdById },
    });

    if (!requests)
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );

    await prisma.material.deleteMany({
      where: { requestId: requestId },
    });

    await prisma.request.delete({
      where: { id: requestId },
    });

    return NextResponse.json(
      { message: "Request deleted successfully" },
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
    const requestId = parseInt(id);
    if (isNaN(requestId)) {
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

    const reqBody = await request.json();

    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );
    }

    const updateData: Prisma.RequestUpdateInput = {};
    if (reqBody.title) updateData.title = reqBody.title;
    if (reqBody.description) updateData.description = reqBody.description;
    if (reqBody.status) updateData.status = reqBody.status;

    if (reqBody.materials) {
      updateData.materials = {
        deleteMany: {},
        create: reqBody.materials.map((item: Prisma.MaterialCreateInput) => ({
          materialName: item.materialName,
          quantity: item.quantity,
        })),
      };
    }

    const updated = await prisma.request.update({
      where: { id: requestId },
      data: updateData,
      include: { materials: true },
    });

    return NextResponse.json(
      {
        message: "Request updated successfully",
        request: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/request error:", error);
    return NextResponse.json(
      { message: "Error updating request", error },
      { status: 500 }
    );
  }
}
