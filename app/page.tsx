import Hero from "@/components/hero"
import About from "@/components/about"
import Programs from "@/components/programs"
import Achievements from "@/components/achievements"
import Infrastructure from "@/components/infrastructure"
import Impact from "@/components/impact"
import Management from "@/components/management"
import Support from "@/components/support"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <About />
      <Programs />
      <Achievements />
      <Infrastructure />
      <Impact />
      <Management />
      <Support />
      <Contact />
      
    </main>
  )
}
