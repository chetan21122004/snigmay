"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Landmark, Building, Dumbbell, Stethoscope } from "lucide-react"

export default function Infrastructure() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const progressRefs = {
    ground: useRef<HTMLDivElement>(null),
    artificial: useRef<HTMLDivElement>(null),
    residential: useRef<HTMLDivElement>(null),
    performance: useRef<HTMLDivElement>(null),
    medical: useRef<HTMLDivElement>(null),
  }

  useEffect(() => {
    if (inView) {
      // Animate progress bars
      const animateProgress = (ref: React.RefObject<HTMLDivElement>, targetValue: number, duration = 1500) => {
        if (!ref.current) return

        let startTime: number | null = null
        const startValue = 0

        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          const value = Math.floor(progress * (targetValue - startValue) + startValue)

          if (ref.current) {
            ref.current.style.width = `${value}%`
            ref.current.setAttribute("aria-valuenow", value.toString())
          }

          if (progress < 1) {
            window.requestAnimationFrame(step)
          }
        }

        window.requestAnimationFrame(step)
      }

      // Set different progress values for each facility
      animateProgress(progressRefs.ground, 30)
      animateProgress(progressRefs.artificial, 45)
      animateProgress(progressRefs.residential, 20)
      animateProgress(progressRefs.performance, 35)
      animateProgress(progressRefs.medical, 50)
    }
  }, [inView])

  const facilities = [
    {
      title: "Natural 11-a-side ground",
      cost: "₹1.2 Cr",
      icon: <Landmark className="h-5 w-5 text-primary" />,
      description: "Full-size professional playing surface for matches and training",
      progressRef: progressRefs.ground,
    },
    {
      title: "Artificial 9-a-side ground",
      cost: "₹85L",
      icon: <Landmark className="h-5 w-5 text-primary" />,
      description: "All-weather training facility for year-round development",
      progressRef: progressRefs.artificial,
    },
    {
      title: "Residential & academic complex",
      cost: "₹3 Cr",
      icon: <Building className="h-5 w-5 text-primary" />,
      description: "Housing, classrooms, and administrative facilities",
      progressRef: progressRefs.residential,
    },
    {
      title: "High-performance center",
      cost: "₹75L",
      icon: <Dumbbell className="h-5 w-5 text-primary" />,
      description: "Gym, swimming pool, and strength & conditioning zones",
      progressRef: progressRefs.performance,
    },
    {
      title: "Medical equipment",
      cost: "₹40L",
      icon: <Stethoscope className="h-5 w-5 text-primary" />,
      description: "Including ambulance and rehabilitation facilities",
      progressRef: progressRefs.medical,
    },
  ]

  return (
    <section id="infrastructure" ref={ref} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Infrastructure & Development</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            We are currently working to expand our facilities to better serve our growing community of players.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="section-subheading">Current Operations</h3>
            <p className="text-muted-foreground mb-6">
              Currently operational at 6 centers, with ambitions to expand to 10 new centers in the next year and 25
              centers within 5 years, significantly increasing our reach and impact across India.
            </p>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <h4 className="font-bold text-lg mb-4">Expansion Goals</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Current Centers</span>
                    <span className="text-sm font-medium">6</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">1-Year Goal</span>
                    <span className="text-sm font-medium">16</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">5-Year Goal</span>
                    <span className="text-sm font-medium">25</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="section-subheading">Future Development</h3>
            <p className="text-muted-foreground mb-6">
              We are raising funds to develop world-class facilities that will support the holistic development of our
              players and provide them with the best possible environment to thrive.
            </p>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <h4 className="font-bold text-lg mb-4">Total Funding Required</h4>
              <div className="text-4xl font-bold text-primary mb-2">₹6.2 Cr</div>
              <p className="text-sm text-muted-foreground mb-4">For complete infrastructure development</p>

              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">35%</span>
              </div>
              <Progress value={35} className="h-2 mb-4" />
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          <h3 className="section-subheading text-center">Infrastructure Development Projects</h3>

          {facilities.map((facility, index) => (
            <Card
              key={index}
              className={`animate-on-scroll ${inView ? "visible" : ""}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {facility.icon}
                    </div>
                    <span>{facility.title}</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{facility.cost}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{facility.description}</p>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Fundraising Progress</span>
                  <span className="text-sm font-medium">
                    {facility.progressRef === progressRefs.ground
                      ? "30%"
                      : facility.progressRef === progressRefs.artificial
                        ? "45%"
                        : facility.progressRef === progressRefs.residential
                          ? "20%"
                          : facility.progressRef === progressRefs.performance
                            ? "35%"
                            : "50%"}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    ref={facility.progressRef}
                    className="h-full bg-primary rounded-full"
                    style={{ width: "0%" }}
                    aria-valuenow={0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
