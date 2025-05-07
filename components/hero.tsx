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
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })

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
        }
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
      className="relative my-10 sm:my-0 w-screen min-h-screen flex-col flex items-center justify-center bg-gradient-to-b from-primary via-primary/70 to-primary/60 text-white pt-16"
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('/images/teams-collage.png?height=100&width=100')] bg-repeat opacity-10"></div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Hero Text */}
          <div ref={textRef} className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Building Nation Through <span className="text-secondary">Sports</span>
            </h1>
            <p className="text-md md:text-xl max-w-2xl mx-auto lg:mx-0">
              Snigmay Foundation is a Pune-based non-profit organization focused on nation-building through youth
              development, sports, and women empowerment.
            </p>
            <div className="flex flex-row gap-4 justify-center lg:justify-start">
              <Link href="/#support" passHref>
                <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold w-full sm:w-auto">
                  Support Our Mission
                </Button>
              </Link>
              <Link href="/#about" passHref>
                <Button size="lg" variant="outline" className="text-black  font-bold w-full hover:bg-white/80 sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div ref={logoRef} className="flex  items-center sm:gap-6 justify-center flex-wrap">
              <Image
                src="/images/snigmaypunefc-logo.png"
                width={300}
                height={300}
                alt="Snigmay Pune FC Logo"
                className="w-40 md:w-80"
                priority
              />
              <Image
                src="/images/snimayfoundation-logo.png"
                width={200}
                height={200}
                alt="Snigmay Foundation Logo"
                className="w-40 md:w-48"
                priority
              />
            </div>
            <p className="text-xl font-semibold mt-3 text-center">INSPIRE | INTEGRATE | EMPOWER</p>
          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div>
        <div
  ref={scrollIndicatorRef}
  className="relative bottom-16 sm:top-24  transform  cursor-pointer animate-bounce "
  onClick={scrollToAbout}
>
  <ChevronDown className="h-10 w-10 text-white opacity-80 transition-opacity duration-600 hover:opacity-100" />
</div>
      </div>
      
    </section>
  )
}
