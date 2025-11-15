import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "User is not logged in" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ message: "Logged out successfully" });
    res.cookies.set({
      name: "token",
      value: "",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Error logging out", detail: String(error) },
      { status: 500 }
    );
  }
}