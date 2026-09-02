import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catalog RAG Assistant",
  description: "A retrieval-augmented product assistant over a retail catalog.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
