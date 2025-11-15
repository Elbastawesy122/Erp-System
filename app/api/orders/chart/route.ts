import { PrismaClient } from "@/app/generated/prisma/client";
import { verifyToken } from "@/lib/verificationtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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

    const userId = verifiedToken.id;
    const isAdmin = verifiedToken.isAdmin;

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const whereClause = {
      createdAt: {
        gte: new Date(year, month, 1),
        lt: new Date(year, month + 1, 1),
      },
      ...(isAdmin ? {} : { OR: [{ acceptedById: userId }] }),
    };

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const chartData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;

      const dailyOrders = orders.filter(
        (o) => new Date(o.createdAt).getDate() === day
      );

      const completed = dailyOrders.filter(
        (o) => o.progress === "Completed"
      ).length;

      return {
        name: day.toString(),
        totalOrders: dailyOrders.length,
        completedOrders: completed,
      };
    });

    return NextResponse.json(chartData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch orders", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
