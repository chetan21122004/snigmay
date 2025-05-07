"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Heart, Share2, Building, Users, Ticket, ShoppingBag } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function Support() {
  const sectionRef = useRef(null)
  const donationFormRef = useRef(null)
  const benefitsRef = useRef(null)

  const [donationAmount, setDonationAmount] = useState(5000)
  const [customAmount, setCustomAmount] = useState("")

  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }

    const ctx = gsap.context(() => {
      // Animate section title and description
      gsap.fromTo(
        sectionRef.current?.querySelector(".section-heading"),
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
        sectionRef.current?.querySelector(".section-heading + p"),
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

      // Animate donation form
      gsap.fromTo(
        donationFormRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: donationFormRef.current,
            start: "top 80%",
          },
        },
      )

      // Animate benefits cards with staggered effect
      gsap.fromTo(
        benefitsRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 80%",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  const handleSliderChange = (value: number[]) => {
    setDonationAmount(value[0])
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    if (e.target.value) {
      setDonationAmount(Number.parseInt(e.target.value))
    }
  }

  const donorBenefits = [
    {
      title: "Social Media Exposure",
      description: "Recognition on our social media platforms",
      icon: <Share2 className="h-5 w-5 text-primary" />,
    },
    {
      title: "On-premises Branding",
      description: "Branding opportunities at our facilities",
      icon: <Building className="h-5 w-5 text-primary" />,
    },
    {
      title: "Employee Engagement",
      description: "Activities for corporate partners' employees",
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      title: "Match Invitations",
      description: "VIP access to matches and events",
      icon: <Ticket className="h-5 w-5 text-primary" />,
    },
    {
      title: "Kit Branding",
      description: "Logo placement on team kits",
      icon: <ShoppingBag className="h-5 w-5 text-primary" />,
    },
  ]

  return (
    <section id="support" ref={sectionRef} className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Support Our Mission</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Your contribution helps us provide opportunities for talented young footballers and build a stronger
            sporting culture in India.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="section-subheading">How Your Donation Helps</h3>
            <p className="text-muted-foreground mb-6">
              Every contribution, regardless of size, makes a significant impact on our ability to support young talent
              and develop world-class facilities.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Per-Player Expenses</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-sm font-medium">Education</p>
                      <p className="text-lg font-bold text-primary">₹35K</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Athletic Diet</p>
                      <p className="text-lg font-bold text-primary">₹1.2L</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Coaching</p>
                      <p className="text-lg font-bold text-primary">₹55K</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tech Training</p>
                      <p className="text-lg font-bold text-primary">₹25K</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tournaments</p>
                      <p className="text-lg font-bold text-primary">₹1L</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Insurance</p>
                      <p className="text-lg font-bold text-primary">₹15K</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Infrastructure Development</h4>
                  <p className="text-muted-foreground">
                    Your donations help us build and maintain world-class facilities that provide the best environment
                    for our players to develop their skills.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Scholarship Programs</h4>
                  <p className="text-muted-foreground">
                    We provide scholarships to talented but underprivileged children, covering their training,
                    education, and living expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div ref={donationFormRef} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Make a Donation</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Donation Amount (₹)</label>
                <div className="space-y-4">
                  <Slider
                    defaultValue={[5000]}
                    max={50000}
                    step={1000}
                    value={[donationAmount]}
                    onValueChange={handleSliderChange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹1,000</span>
                    <span>₹25,000</span>
                    <span>₹50,000</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="flex-1"
                    />
                    <div className="text-2xl font-bold">₹{donationAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDonationAmount(1000)
                    setCustomAmount("")
                  }}
                >
                  ₹1,000
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDonationAmount(5000)
                    setCustomAmount("")
                  }}
                >
                  ₹5,000
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDonationAmount(10000)
                    setCustomAmount("")
                  }}
                >
                  ₹10,000
                </Button>
              </div>

              <div className="space-y-4">
                <Input placeholder="Full Name" />
                <Input placeholder="Email Address" type="email" />
                <Input placeholder="Phone Number" type="tel" />
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white">Donate Now</Button>

              <p className="text-xs text-muted-foreground text-center">
                All donations are tax-deductible under Section 80G of the Income Tax Act.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="section-subheading text-center mb-8">Donor Benefits</h3>
          <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donorBenefits.map((benefit, index) => (
              <Card key={index} className="animate-on-scroll">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
