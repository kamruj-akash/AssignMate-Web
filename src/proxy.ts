import { UserRole } from "@/type";
import jwt from "jsonwebtoken";
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

const verifyToken = (
  token: string | undefined,
  secret: string,
): ITokenPayload | null => {
  if (!token || !secret) return null;
  try {
    const decoded = jwt.verify(token, secret) as ITokenPayload;
    return decoded.role in roleHome ? decoded : null;
  } catch {
    return null;
  }
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The API renews an expired access token from the refresh token,
  // so a valid refresh token alone still counts as signed in.
  const user =
    verifyToken(
      request.cookies.get("accessToken")?.value,
      envConfig.JWT_ACCESS_SECRET,
    ) ??
    verifyToken(
      request.cookies.get("refreshToken")?.value,
      envConfig.JWT_REFRESH_SECRET,
    );

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
