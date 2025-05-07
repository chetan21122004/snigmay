import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Preloader } from "@/components/Preloader"

import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/footer"
import Script from "next/script"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Snigmay Foundation | Inspire | Integrate | Empower",
  description:
    "Snigmay Foundation is a Pune-based non-profit organization focused on nation-building through youth development, sports, and women empowerment.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <Preloader />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="beforeInteractive" />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
