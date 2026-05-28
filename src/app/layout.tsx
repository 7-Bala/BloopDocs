import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import CursorTrail from "@/components/CursorTrail";
import "./globals.css";

// Load Outfit from Google Fonts with standard cinematic weights
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Premium SEO Viewport config
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Premium SEO Metadata
export const metadata: Metadata = {
  title: "BloopDocs",
  description: 
    "Transform documents seamlessly between Microsoft formats (DOCX, PPTX, XLSX), Apple iWork formats (Pages, Keynote, Numbers), and universally to PDF. Experience gorgeous animations and layout preservation.",
  keywords: [
    "document converter", "pages to docx", "keynote to pptx", "numbers to xlsx", 
    "apple to microsoft", "convert to pdf", "office translator", "bloopdocs"
  ],
  authors: [{ name: "BloopDocs Translation Labs" }],
  openGraph: {
    title: "BloopDocs",
    description: "Preserve layout, grids, and style typography transitions instantly.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col selection:bg-[#903635] selection:text-[#C4B883]">
        {/* Mount Toast Context Provider across the entire app hierarchy */}
        <ToastProvider>
          <CursorTrail />
          <div className="flex-grow flex flex-col relative z-10">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
