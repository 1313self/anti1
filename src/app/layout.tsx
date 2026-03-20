import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/ui/toast";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EraConnect | Campus Networking Evolved",
    template: "%s | EraConnect"
  },
  description: "A premium campus networking platform for modern students. Connect, collaborate, and grow with EraConnect.",
  keywords: ["campus networking", "student collaboration", "university networking", "EraConnect"],
  authors: [{ name: "EraConnect Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eraconnect.vercel.app",
    siteName: "EraConnect",
    title: "EraConnect | Campus Networking Evolved",
    description: "Premium networking for modern university students.",
    images: [
      {
        url: "/og-image.png", // User would need to add this
        width: 1200,
        height: 630,
        alt: "EraConnect Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EraConnect | Campus Networking Evolved",
    description: "Premium networking for modern university students.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jakarta.variable} antialiased font-body`}
      >
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
