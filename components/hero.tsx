"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }

    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" })

      // Text animation with staggered effect
      gsap.fromTo(
        textRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          delay: 0.5,
        },
      )

      // Logo animation
      gsap.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          delay: 0.8,
          ease: "elastic.out(1, 0.75)",
        },
      )

      // Scroll indicator animation
      gsap.fromTo(
        scrollIndicatorRef.current,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 1.5,
          ease: "power2.out",
          yoyo: true,
          repeat: -1,
          repeatDelay: 1,
        },
      )
    })

    return () => ctx.revert()
  }, [])

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-primary via-primary/70 to-primary/60 text-white pt-16"
    >
      {/* Background overlay with pattern */}
      <div className="absolute inset-0 bg-[url('/images/teams-collage.png?height=100&width=100')] bg-repeat opacity-10"></div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div ref={textRef} className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Building Nation Through <span className="text-secondary">Sports</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
              Snigmay Foundation is a Pune-based non-profit organization focused on nation-building through youth
              development, sports, and women empowerment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold">
                <Link href="/#support">Support Our Mission</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-primary  hover:text-primary/85  font-bold	">
                <Link href="/#about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div ref={logoRef} className="flex  items-center gap-6 justify-center ">
              <Image
                src="/images/snigmaypunefc-logo.png"
                width={300}
                alt="Snigmay Pune FC Logo"
                height={300}
              className="w-64     md:w-80 "
              priority
            />
            <Image
              src="/images/snimayfoundation-logo.png"
              width={200}
              alt="Snigmay Foundation Logo"
              height={200}
              className="w-64 md:w-48"
              priority
              />
            </div>
            <p className="text-xl font-semibold mt-3">INSPIRE | INTEGRATE | EMPOWER</p>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToAbout}
      >
        <ChevronDown className="h-10 w-10" />
      </div>
    </section>
  )
}
