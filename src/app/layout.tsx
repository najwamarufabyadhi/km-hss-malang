import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "KM-HSS Malang — Kerukunan Mahasiswa Hulu Sungai Selatan",
    template: "%s | KM-HSS Malang",
  },
  description:
    "Portal resmi Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS): profil organisasi, berita kegiatan, dan struktur kepengurusan.",
  icons: {
    icon: "/logo-km-hss.png",
    apple: "/logo-km-hss.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
