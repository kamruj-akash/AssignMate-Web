"use client";
import GoogleProvider from "./google.provider";
import QueryProvider from "./query.provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleProvider>
      <QueryProvider>{children}</QueryProvider>;
    </GoogleProvider>
  );
}
