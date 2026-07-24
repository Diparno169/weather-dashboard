import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LocationProvider } from "@/contexts/LocationContext";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { OnlineStatusBanner } from "@/components/layout/OnlineStatusBanner";
import "./globals.css";

// NOTE: next/font/google (Inter, Manrope) requires network access to
// fonts.googleapis.com at build time. Re-enable it once deploying somewhere
// with internet access — it was swapped for a system stack here only because
// this sandbox can't reach Google Fonts:
//
//   import { Inter, Manrope } from "next/font/google";
//   const manrope = Manrope({ subsets: ["latin"], variable: "--font-display" });
//   const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://skyline-weather.vercel.app"),
  title: "Skyline — Premium Weather Forecast",
  description:
    "Beautiful, precise weather forecasts — current conditions, hourly and 5-day outlooks, air quality, and more.",
  keywords: ["weather", "forecast", "weather app", "climate", "air quality"],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Skyline — Premium Weather Forecast",
    description: "Know the sky before you step out.",
    type: "website",
    siteName: "Skyline",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skyline — Premium Weather Forecast",
    description: "Know the sky before you step out.",
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white font-sans antialiased dark:bg-[#030712]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          storageKey="skyline-theme"
        >
          <LocationProvider>
            <ServiceWorkerRegister />
            <OnlineStatusBanner />
            <Navbar />
            <div className="min-h-screen">{children}</div>
            <Footer />
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
