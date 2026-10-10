import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Cinzel } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Utsav & Devanshi | A Timeless Union",
  description: "Two family invitations for the Gujarati Hindu wedding celebrations of Utsav Shah and Devanshi Sutaria.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${greatVibes.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#2D2522]">
        {children}
      </body>
    </html>
  );
}

