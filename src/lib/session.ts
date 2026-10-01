import { cookies } from "next/headers";

export const hasSession = async () => {
  const cookieStore = await cookies();
  return cookieStore.has("accessToken") || cookieStore.has("refreshToken");
};
