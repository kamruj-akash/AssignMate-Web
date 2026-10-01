import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import Providers from "@/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";

const robotoSlabHeading = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-heading",
});

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AssignMate - Your Assignment Companion",
  description:
    "AssignMate is your ultimate assignment companion, designed to help students excel in their academic journey. With AssignMate, you can effortlessly manage your assignments, track deadlines, and access a wealth of resources to enhance your learning experience. Stay organized, meet your deadlines, and achieve academic success with AssignMate by your side.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        roboto.variable,
        robotoSlabHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}

          <Toaster />
        </Providers>{" "}
      </body>
    </html>
  );
}
