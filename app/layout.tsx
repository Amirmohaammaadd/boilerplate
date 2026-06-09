import "./globals.css";
import type { Metadata } from "next";
import { danaFont } from "./fonts/dana/woff2/font";
import AppProvider from "@/lib/AppProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),

  title: {
    default: "Snapp Store",
    template: "%s | Snapp Store",
  },

  description: "Snapp Store",

  keywords: [
    "Snapp Store",
    "فروشگاه اینترنتی",
    "online shop",
    "ecommerce",
  ],

  authors: [{ name: "Snapp Store Team" }],
  creator: "Snapp Store",
  publisher: "Snapp Store",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    title: "Snapp Store",
    description: "تجربه سریع و مدرن خرید آنلاین",
    url: "https://your-domain.com",
    siteName: "Snapp Store",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Snapp Store",
      },
    ],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: "https://your-domain.com",
  },

  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${danaFont.className} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}