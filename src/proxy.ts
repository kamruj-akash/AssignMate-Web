import { UserRole } from "@/type";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import envConfig from "./config/envConfig";

// const unauthorizedCCount: number = 0;

interface ITokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp?: number;
}

const roleHome: Record<UserRole, string> = {
  ADMIN: "/admin",
  STUDENT: "/student",
  EXPERT: "/expert",
};

const authRoutes = ["/login", "/register", "/verify"];

const matchesRoute = (path: string, route: string) =>
  path === route || path.startsWith(`${route}/`);

const decodeToken = (token?: string): ITokenPayload | null => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET) as ITokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const user = decodeToken(cookieStore.get("accessToken")?.value);
  console.log(user);

  if (authRoutes.some((route) => matchesRoute(pathname, route))) {
    if (user) {
      return NextResponse.redirect(new URL(roleHome[user.role], request.url));
    }
    return NextResponse.next();
  }

  const requiredRole = (Object.keys(roleHome) as UserRole[]).find((role) =>
    matchesRoute(pathname, roleHome[role]),
  );

  if (!requiredRole) return NextResponse.next();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user.role !== requiredRole) {
    return NextResponse.redirect(new URL(roleHome[user.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/expert/:path*",
    "/login",
    "/register",
    "/verify",
  ],
};
