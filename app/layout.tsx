import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import IdleManager from "@/components/IdleManager";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "ShopMate AI",
  description: "Smart Shopping Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fredoka.variable} font-inter bg-bg-cream text-primary-brown antialiased flex`}>
        <IdleManager />
        <Sidebar />
        <main className="flex-1 min-h-screen relative pb-24 md:pb-0 md:ml-24">
          {children}
        </main>
      </body>
    </html>
  );
}
