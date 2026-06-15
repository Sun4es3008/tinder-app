import type { Metadata } from "next";
import "./globals.css";
import MobileWrapper from "@/components/MobileWrapper";

export const metadata: Metadata = {
  title: "Tinder Premium | Найди свою половинку",
  description: "Премиальное веб-приложение для знакомств. Свайпай, общайся, встречайся.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased dark">
      <body className="min-h-full bg-black">
        <MobileWrapper>
          {children}
        </MobileWrapper>
      </body>
    </html>
  );
}
