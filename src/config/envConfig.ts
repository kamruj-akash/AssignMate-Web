const envConfig = {
  PUBLIC_API: process.env.NEXT_PUBLIC_API_BASE_URL as string,
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
};

export default envConfig;
