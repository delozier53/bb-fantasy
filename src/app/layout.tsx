import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/ui/app-header";
import { BottomTabs } from "@/components/ui/bottom-tabs";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Big Brother Fantasy League",
  description: "Fantasy league for Big Brother Season 27 - Pick your houseguests and compete!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BB Fantasy",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/logo.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <AppHeader />
            {children}
            <BottomTabs />
            <Toaster />

          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
