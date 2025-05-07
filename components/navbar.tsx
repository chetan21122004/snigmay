"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Programs", href: "/#programs" },
  { name: "Achievements", href: "/#achievements" },
  { name: "Infrastructure", href: "/#infrastructure" },
  { name: "Impact", href: "/#impact" },
  { name: "Management", href: "/management" },
  { name: "Support Us", href: "/#support" },
  { name: "Contact", href: "/#contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full   z-50 transition-all duration-300 py-2",
        scrolled ? "bg-[#ffbf00] dark:bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-[#ffbf00] ",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/snigmaypunefc-logo.png"
            alt="Snigmay Pune FC Logo"
            width={60}
            height={60}
            className="h-12 w-auto"
          />
          <Image
            src="/images/snimayfoundation-logo.png"
            alt="Snigmay Foundation Logo"
            width={40}
            height={40}
            className="h-10 w-auto hidden md:block"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                scrolled ? "text-foreground" : "text-black",
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/#support">Donate Now</Link>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-background z-40 p-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium py-2 border-b border-border"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="mt-4 bg-primary hover:bg-primary/90 text-white">
                <Link href="/#support">Donate Now</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
