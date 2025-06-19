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
    <section id="impact" ref={ref} className="py-12 bg-white dark:bg-gray-900">
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
        
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="section-heading">Problem Statement</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Key challenges we're addressing in youth football development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className={`animate-on-scroll ${inView ? "visible" : ""}`}>
              <CardContent className="p-6">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">01. Social Inequality</h3>
                <p className="text-muted-foreground">
                  Many underprivileged children lack access to quality football coaching and opportunities to showcase their talent.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`animate-on-scroll ${inView ? "visible" : ""} delay-100`}>
              <CardContent className="p-6">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">02. Limited Resources</h3>
                <p className="text-muted-foreground">
                  Few organisations have the necessary infrastructure, training facilities, and resources to support these children.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`animate-on-scroll ${inView ? "visible" : ""} delay-200`}>
              <CardContent className="p-6">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">03. Missed Potential</h3>
                <p className="text-muted-foreground">
                  Without proper guidance, these children may not have the opportunity to develop their skills and pursue a career in football.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`animate-on-scroll ${inView ? "visible" : ""} delay-300`}>
              <CardContent className="p-6">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">04. Lack of Visibility</h3>
                <p className="text-muted-foreground">
                  Many still don't know that playing professional football can be a rewarding & flourishing career even in India.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <div className="text-center mb-12">
            <h2 className="section-heading">Our Goals & Objectives</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              How we're creating lasting change through football
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={`animate-on-scroll ${inView ? "visible" : ""}`}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">01. Skill Development</h3>
                <p className="text-muted-foreground">
                  We aim to provide comprehensive football training to underprivileged children, helping them develop their skills and reach their full potential.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`animate-on-scroll ${inView ? "visible" : ""} delay-100`}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">02. Social Inclusion</h3>
                <p className="text-muted-foreground">
                  Through football, we strive to create a more inclusive society, breaking down barriers based on socio-economic backgrounds.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`animate-on-scroll ${inView ? "visible" : ""} delay-200`}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">03. Empowerment</h3>
                <p className="text-muted-foreground">
                  By equipping these children with life skills and self-confidence, we aim to empower them to overcome challenges and succeed in all aspects of life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
