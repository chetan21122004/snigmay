"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe, Award, TrendingUp } from "lucide-react"

export default function Impact() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const counterRefs = {
    investment: useRef<HTMLSpanElement>(null),
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

      animateCounter(counterRefs.investment, 10, 2000, "₹", "L")
      animateCounter(counterRefs.players, 150000)
      animateCounter(counterRefs.professional, 500)
      animateCounter(counterRefs.lives, 15000)
    }
  }, [inView])

  return (
    <section id="impact" ref={ref} className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Our Impact</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            The long-term impact of our programs extends far beyond the football field, creating lasting change in
            communities across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className={`animate-on-scroll ${inView ? "visible" : ""}`}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="counter-value">
                <span ref={counterRefs.investment}>₹0L</span>
              </div>
              <p className="counter-label">Average investment per player over 10 years</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Per-Player Investment</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Education</span>
                <span className="font-bold">₹35K</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: "10%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Athletic diet</span>
                <span className="font-bold">₹1.2L</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: "35%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Coaching</span>
                <span className="font-bold">₹55K</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: "15%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Tech-driven training</span>
                <span className="font-bold">₹25K</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: "7%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Tournaments</span>
                <span className="font-bold">₹1L</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: "30%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Insurance</span>
                <span className="font-bold">₹15K</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: "5%" }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Return on Investment</h3>
            <p className="text-muted-foreground mb-6">
              Our programs are designed to be cost-effective while maximizing impact. For every rupee invested, we
              create multiple returns in terms of:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Award className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Professional Opportunities</h4>
                  <p className="text-sm text-muted-foreground">Creating pathways to professional careers in sports</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Users className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Community Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Building stronger, healthier communities through sports
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Globe className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">National Representation</h4>
                  <p className="text-sm text-muted-foreground">
                    Developing talent that represents India on international stages
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Economic Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    Creating jobs and economic opportunities in the sports sector
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
