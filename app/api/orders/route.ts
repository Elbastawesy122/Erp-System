import { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import { OrderSchema } from "@/lib/dto";
import { orderRequest } from "@/lib/interface";
import { verifyToken } from "@/lib/verificationtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = (await request.json()) as orderRequest;

    const validatedData = OrderSchema.safeParse(body);

    if (!validatedData.success) {
      const zodError = validatedData.error;
      return NextResponse.json(
        { message: "Invalid data", errors: zodError.format() },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        customerName: validatedData.data.customerName,
        dueDate: validatedData.data.dueDate,
        status: validatedData.data.status,
        createdById: (verifiedToken.id as number) || 0,
        material: {
          create: validatedData.data.material.map((item) => ({
            materialName: item.materialName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json(
      { message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create order", error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const prisma = new PrismaClient();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const verifiedToken = verifyToken(token);
    if (!verifiedToken) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const progress = searchParams.get("progress");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 6;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;
    if (progress) where.progress = progress;

    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { material: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json(
      {
        message: "Orders retrieved successfully",
        orders,
        totalPages,
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch orders", error },
      { status: 500 }
    );
  }
}
