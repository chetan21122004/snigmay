"use client"

import Hero from "@/components/hero"
import About from "@/components/about"
import Programs from "@/components/programs"
import Achievements from "@/components/achievements"
import Infrastructure from "@/components/infrastructure"
import Impact from "@/components/impact"
import Management from "@/components/management"
import Support from "@/components/support"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <Hero />
      <About />
      <Impact />
      <Programs />
      <Achievements />
      <Infrastructure />
      {/* <Management /> */}
      <Support />
      <Contact />
    </main>
  )
}
