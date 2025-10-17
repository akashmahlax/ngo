import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SessionProvider } from "next-auth/react";
import { SiteNavbar } from "@/components/site-navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Volunteer-NGO Job Platform",
  description:
    "Connect NGOs with volunteers. Post projects, apply, and track outcomes.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Volunteer-NGO Job Platform",
    description:
      "Connect NGOs with volunteers. Post projects, apply, and track outcomes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Volunteer-NGO Job Platform",
    description:
      "Connect NGOs with volunteers. Post projects, apply, and track outcomes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
        <SessionProvider>
         {/*  <Navbar /> */}
         <SiteNavbar />
          {children}
          <Footer />
          </SessionProvider>
        </ThemeProvider>
       
      </body>
    </html>
  );
}
