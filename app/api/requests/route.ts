import { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import { RequestSchema } from "@/lib/dto";
import { requestRequest } from "@/lib/interface";
import { verifyToken } from "@/lib/verificationtoken";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const verifiedToken = verifyToken(token);
    if (!verifiedToken || verifiedToken.isAdmin) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = (await request.json()) as requestRequest;

    const validatedData = RequestSchema.safeParse(body);
    if (!validatedData.success) {
      const zodError = validatedData.error;
      return NextResponse.json(
        { message: "Invalid data", errors: zodError.format() },
        { status: 400 }
      );
    }

    const newrequests = await prisma.request.create({
      data: {
        title: validatedData.data.title,
        description: validatedData.data.description,
        createdById: verifiedToken.id,
        materials: {
          create: validatedData.data.materials.map((item) => ({
            materialName: item.materialName,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        materials: true,
      },
    });

    return NextResponse.json(
      { message: "store created successful", newrequests },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { message: "Error fetching store data", error },
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 6;
    const skip = (page - 1) * limit;

    const where: Prisma.RequestWhereInput = {};

    if (status) where.status = status;

    const [requests, totalrequests] = await Promise.all([
      await prisma.request.findMany({
        where,
        include: {
          materials: true,
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.request.count({ where }),
    ]);

    const totalPages = Math.ceil(totalrequests / limit);

    return NextResponse.json(
      { message: "Store API is working!", requests, totalPages },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching store data", error },
      { status: 500 }
    );
  }
}
