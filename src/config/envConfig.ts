const envConfig = {
  PUBLIC_API: process.env.NEXT_PUBLIC_API_BASE_URL as string,
  // Server components can't use the relative /api/v1 path, so they hit the
  // backend directly. Falls back to the public URL when it's already absolute.
  SERVER_API: process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL.replace(/\/$/, "")}/api/v1`
    : (process.env.NEXT_PUBLIC_API_BASE_URL as string),
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
};

export default envConfig;
