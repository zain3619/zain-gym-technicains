import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  COMPANY_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SEO_KEYWORDS,
  SITE_URL,
} from "./lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: COMPANY_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: COMPANY_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  category: "fitness business",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
