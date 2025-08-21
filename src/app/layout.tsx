import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/ui/app-header";
import { BottomTabs } from "@/components/ui/bottom-tabs";
import { PWAInstaller } from "@/components/pwa-installer";
import { registerServiceWorker } from "@/lib/sw-register";

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
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
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
            <PWAInstaller />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js');
                    });
                  }
                `,
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
