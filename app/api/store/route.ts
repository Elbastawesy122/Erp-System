import { PrismaClient } from "@/app/generated/prisma/client";
import { StoreSchema } from "@/lib/dto";
import { storeRequest } from "@/lib/interface";
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
    if (!verifiedToken || !verifiedToken.isAdmin) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = (await request.json()) as storeRequest;
    const validatedData = StoreSchema.safeParse(body);
    if (!validatedData.success) {
      const zodError = validatedData.error;
      return NextResponse.json(
        { message: "Invalid data", errors: zodError.format() },
        { status: 400 }
      );
    }

    const product = await prisma.store.create({
      data: {
        name: validatedData.data.name,
        quantity: validatedData.data.quantity,
      },
    });

    return NextResponse.json(
      { message: "store created successful", product },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching store data", error },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
  const prisma = new PrismaClient();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const verifiedToken = verifyToken(token);
    if (!verifiedToken || !verifiedToken.isAdmin) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { products } = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    const resultProducts = [];

    for (const product of products) {
      const validated = StoreSchema.safeParse(product);
      if (!validated.success) continue;

      const data = validated.data;

      if (data.id) {
        const updated = await prisma.store.update({
          where: { id: data.id },
          data: {
            name: data.name,
            quantity: data.quantity,
          },
        });
        resultProducts.push(updated);
      } else {
        const created = await prisma.store.create({
          data: {
            name: data.name,
            quantity: data.quantity,
          },
        });
        resultProducts.push(created);
      }
    }

    return NextResponse.json(
      {
        message: "Products updated/created successfully",
        products: resultProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/store error:", error);
    return NextResponse.json(
      { message: "Error updating or creating products", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const verifiedToken = verifyToken(token);
    if (!verifiedToken ) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const products = await prisma.store.findMany();

    return NextResponse.json(
      { message: "Store API is working!", products },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching store data", error },
      { status: 500 }
    );
  }
}
