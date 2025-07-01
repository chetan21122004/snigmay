"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe, Award, TrendingUp, Users2, Briefcase, Target, Eye } from "lucide-react"

export default function Impact() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const counterRefs = {
    nationalPlayers: useRef<HTMLSpanElement>(null),
    players: useRef<HTMLSpanElement>(null),
    professional: useRef<HTMLSpanElement>(null),
    lives: useRef<HTMLSpanElement>(null),
  }

  useEffect(() => {
    if (inView) {
      // Animate counters
      const animateCounter = (
        ref: React.RefObject<HTMLSpanElement>,
        target: number,
        duration = 2000,
        prefix = "",
        suffix = "",
      ) => {
        if (!ref.current) return

        let startTime: number | null = null
        const startValue = 0

        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          const value = Math.floor(progress * (target - startValue) + startValue)

          if (ref.current) {
            ref.current.textContent = `${prefix}${value.toLocaleString()}${suffix}`
          }

          if (progress < 1) {
            window.requestAnimationFrame(step)
          } else if (ref.current) {
            ref.current.textContent = `${prefix}${target.toLocaleString()}${suffix}`
          }
        }

        window.requestAnimationFrame(step)
      }

      animateCounter(counterRefs.nationalPlayers, 20)
      animateCounter(counterRefs.players, 150000)
      animateCounter(counterRefs.professional, 500)
      animateCounter(counterRefs.lives, 15000)
    }
  }, [inView])

  return (
    <section id="impact" ref={ref} className=" bg-white dark:bg-gray-900">
      <div className="container mx-auto px-8 sm:px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Our Impact</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            The long-term impact of our programs extends far beyond the football field, creating lasting change in
            communities across India.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <Card className={`animate-on-scroll ${inView ? "visible" : ""}`}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="counter-value">
                <span ref={counterRefs.nationalPlayers}>0</span>+
              </div>
              <p className="counter-label">Projected National Players in Next 10 Years</p>
            </CardContent>
          </Card>

          <Card className={`animate-on-scroll ${inView ? "visible" : ""} delay-100`}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="counter-value">
                <span ref={counterRefs.players}>0</span>
              </div>
              <p className="counter-label">Overall usage projections (talented players)</p>
            </CardContent>
          </Card>

          <Card className={`animate-on-scroll ${inView ? "visible" : ""} delay-200`}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="counter-value">
                <span ref={counterRefs.professional}>0</span>
              </div>
              <p className="counter-label">Professional player development projections</p>
            </CardContent>
          </Card>

          <Card className={`animate-on-scroll ${inView ? "visible" : ""} delay-300`}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <div className="counter-value">
                <span ref={counterRefs.lives}>0</span>
              </div>
              <p className="counter-label">Total lives impacted across India</p>
            </CardContent>
          </Card>
        </div>
        
      
      </div>
    </section>
  )
}
