import "./globals.css";
import type { Metadata, Viewport } from "next";
import { danaFont } from "./fonts/dana/woff2/font";
import AppProvider from "@/providers/AppProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My App",
  }, 

  title: {
    default: "boilerplate",
    template: "",
  },

  description: "boilerplate",

  keywords: [
    "boilerplate",
  ],

  authors: [{ name: "Amir moahammad Abdolahi" }],
  creator: "boilerplate",
  publisher: "boilerplate",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    title: "boilerplate",
    description: "boilerplate",
    url: "https://your-domain.com",
    siteName: "boilerplate",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "boilerplate",
      },
    ],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: "https://your-domain.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#00afaa",
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