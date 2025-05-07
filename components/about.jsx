"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Users, Heart, Award } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function About() {
  const sectionRef = useRef(null)
  const cardsRef = useRef(null)
  const statsRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }

    const ctx = gsap.context(() => {
      // Animate the section title and description
      gsap.fromTo(
        sectionRef.current.querySelector(".section-heading"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      )

      gsap.fromTo(
        sectionRef.current.querySelector(".section-heading + p"),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      )

      // Animate the text content
      gsap.fromTo(
        textRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          },
        },
      )

      // Animate the image
      gsap.fromTo(
        imageRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
          },
        },
      )

      // Animate the stats with counter effect
      const counterElements = statsRef.current?.querySelectorAll("[data-counter]") || []

      counterElements.forEach((element) => {
        const target = Number.parseInt(element.getAttribute("data-counter-target") || "0", 10)

        gsap.fromTo(
          element,
          { innerText: "0" },
          {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 }, // Snap to integer values
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
            },
            onUpdate: function () {
              // @ts-ignore
              element.innerText = Math.floor(this.targets()[0].innerText)
            },
          },
        )
      })

      // Animate the cards with staggered effect
      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">About Snigmay Foundation</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            A Pune-based non-profit organization focused on nation-building through youth development, sports, and women
            empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div ref={textRef} className="space-y-6">
            <h3 className="section-subheading">Our Vision & Mission</h3>
            <p className="text-muted-foreground">
              Snigmay Foundation embraces the philosophy of "Inspire | Integrate | Empower" as reflected in our circular
              logo. Our approach centers on holistic development, addressing not just athletic skills but also physical,
              mental, social, educational, and behavioral aspects of a child's growth.
            </p>
            <div ref={statsRef} className="grid grid-cols-2 gap-4 mt-8">
              <div className="text-center">
                <div className="counter-value">
                  <span data-counter data-counter-target="500">
                    0
                  </span>
                  +
                </div>
                <div className="counter-label">Talented Footballers</div>
              </div>
              <div className="text-center">
                <div className="counter-value">
                  <span data-counter data-counter-target="6">
                    0
                  </span>
                </div>
                <div className="counter-label">Training Centers</div>
              </div>
              <div className="text-center">
                <div className="counter-value">
                  <span data-counter data-counter-target="10">
                    0
                  </span>
                  +
                </div>
                <div className="counter-label">Years of Experience</div>
              </div>
              <div className="text-center">
                <div className="counter-value">
                  <span data-counter data-counter-target="25">
                    0
                  </span>
                  +
                </div>
                <div className="counter-label">Major Achievements</div>
              </div>
            </div>
          </div>
          <div ref={imageRef} className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/teams-collage.png"
              alt="Snigmay Football Teams"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Card className="animate-on-scroll">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Social inequality</h3>
              <p className="text-muted-foreground">
                Addressing social inequality in sports access for underprivileged youth
              </p>
            </CardContent>
          </Card>

          <Card className="animate-on-scroll">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Limited resources</h3>
              <p className="text-muted-foreground">Providing resources for talented but underprivileged children</p>
            </CardContent>
          </Card>

          <Card className="animate-on-scroll">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Missed potential</h3>
              <p className="text-muted-foreground">Preventing missed potential due to lack of guidance and support</p>
            </CardContent>
          </Card>

          <Card className="animate-on-scroll">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Career visibility</h3>
              <p className="text-muted-foreground">
                Increasing visibility of football as a viable career path in India
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
