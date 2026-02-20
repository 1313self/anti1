import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google"; // Updated fonts
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

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
  title: "EraConnect - Campus Networking",
  description: "EraConnect is a campus networking platform using dating-app logic for peer-matching.",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
