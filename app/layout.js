import { Syne, Manrope, Poppins } from "next/font/google";
import "./globals.css";
import ExperienceProviders from "./components/providers/ExperienceProviders";
import {
  COMPANY_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SEO_KEYWORDS,
  SITE_URL,
} from "./lib/seo";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
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

export const viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="section-snap bg-[#050505]" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${manrope.variable} ${poppins.variable} bg-[#050505] font-body antialiased`}
        suppressHydrationWarning
      >
        <div
          aria-hidden
          className="page-canvas pointer-events-none fixed inset-0 -z-50 bg-[#050505]"
        />
        <ExperienceProviders>{children}</ExperienceProviders>
      </body>
    </html>
  );
}
