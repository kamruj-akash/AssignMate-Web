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

const verifyToken = (
  token: string | undefined,
  secret: string,
): ITokenPayload | null => {
  // console.log(token, secret);
  if (!token || !secret) return null;
  try {
    const decoded = jwt.verify(token, secret) as ITokenPayload;
    return decoded.role in roleHome ? decoded : null;
  } catch {
    return null;
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  // const refreshToken = cookieStore.get("refreshToken")?.value;
  // if (!accessToken) {
  //   // generate a new access token using the refresh token
  //   const newAccessToken = await apiClient("/auth/get-new-token", {
  //     method: "POST",
  //   });
  //   console.log(newAccessToken);
  // }

  const user = verifyToken(accessToken, envConfig.JWT_ACCESS_SECRET);
  // console.log(user)
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
