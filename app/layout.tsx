import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Unbounded } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["cyrillic", "latin"],
});

const unbounded = Unbounded({
  variable: "--font-display",
  subsets: ["cyrillic", "latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Егор Фенин — Backend-разработчик",
  description: "Интерактивное резюме Егора Фенина — Python и backend-разработка.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${unbounded.variable} ${cormorant.variable}`}>
        {children}
      </body>
    </html>
  );
}
