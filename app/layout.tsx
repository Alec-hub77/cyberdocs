import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { getRoadmap } from "@/lib/roadmap";

export const metadata: Metadata = {
  title: "cyberdocs — база знань з кібербезпеки",
  description:
    "Особиста база знань з кібербезпеки: статті, інструменти, команди та roadmap для навчання.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const roadmap = getRoadmap();

  return (
    <html lang="uk">
      <body>
        <AppShell roadmap={roadmap}>{children}</AppShell>
      </body>
    </html>
  );
}
