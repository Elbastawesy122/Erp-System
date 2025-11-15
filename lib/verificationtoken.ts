import jwt from "jsonwebtoken";
import { isValid } from "@/lib/interface";

export function verifyToken(token?: string): (isValid & { id: number }) | null {
  const JWTSecret = process.env.JWT_SECRET!;
  try {
    if (!token) return null;

    const decoded = jwt.verify(token, JWTSecret);

    if (typeof decoded === "string") return null;

    const { id, email, name, isAdmin } = decoded as isValid & { id: number };

    return { id, email, name, isAdmin };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
