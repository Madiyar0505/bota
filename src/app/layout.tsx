import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { AuthProvider } from "@/components/auth-provider";
import { VideoProvider } from "@/context/VideoContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Бота",
  description: "Ботаның жеке сайты",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <VideoProvider>
            <div className="h-full flex">
              <Sidebar />
              <main className="flex-1 h-full overflow-y-auto bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
                {children}
              </main>
            </div>
          </VideoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
