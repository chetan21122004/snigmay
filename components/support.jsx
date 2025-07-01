"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Heart,
  Share2,
  Building,
  Users,
  Ticket,
  ShoppingBag,
  TrendingUp,
  FileText,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Support() {
  const sectionRef = useRef(null);
  const donationFormRef = useRef(null);
  const benefitsRef = useRef(null);

  const [donationAmount, setDonationAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
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
        }
      );

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
        }
      );

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
        }
      );

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
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSliderChange = (value) => {
    setDonationAmount(value[0]);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    if (e.target.value) {
      setDonationAmount(Number.parseInt(e.target.value));
    }
  };

  const donorBenefits = [
    {
      title: "National Level Impact",
      description: "Be part of a transformative movement shaping the future of Indian football through youth development and empowerment",
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
    {
      title: "Impact Transparency",
      description: "Receive detailed quarterly reports and success stories showcasing the direct impact of your contribution on young lives",
      icon: <Share2 className="h-5 w-5 text-primary" />,
    },
    {
      title: "Recognition & Visibility",
      description: "Gain recognition through our digital platforms, annual reports, and events while maintaining optional anonymity",
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      title: "Personal Fulfilment & Involvement",
      description: "Experience the joy of directly contributing to youth development and participate in our community initiatives",
      icon: <Heart className="h-5 w-5 text-primary" />,
    },
    {
      title: "CSR Partnership",
      description: "Align your corporate social responsibility goals with measurable community impact and youth empowerment",
      icon: <Building className="h-5 w-5 text-primary" />,
    },
    {
      title: "Tax Exemption",
      description: "Benefit from tax deductions under Section 80G of the Income Tax Act with complete documentation support",
      icon: <FileText className="h-5 w-5 text-primary" />,
    },
    {
      title: "Exclusive Event Access",
      description: "Enjoy VIP access to tournaments, training sessions, award ceremonies, and networking events. Connect with players, coaches, and fellow supporters",
      icon: <Ticket className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <section
      id="support"
      ref={sectionRef}
      className="py-12 bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-8 sm:px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Support Our Mission</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Your contribution helps us provide opportunities for talented young
            footballers and build a stronger sporting culture in India.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="section-subheading">How Your Donation Helps</h3>
            <p className="text-muted-foreground mb-6">
              Every contribution, regardless of size, makes a significant impact
              on our ability to support young talent and develop world-class
              facilities.
            </p>

            <div className="space-y-6">
             

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">
                    Infrastructure Development
                  </h4>
                  <p className="text-muted-foreground">
                    Your donations help us build and maintain world-class
                    facilities that provide the best environment for our players
                    to develop their skills.
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
                    We provide scholarships to talented but underprivileged
                    children, covering their training, education, and living
                    expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={donationFormRef}
            className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-6">Contact Us to Donate</h3>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-4">How to Contribute</h4>
                <p className="text-muted-foreground mb-4">
                  To make a donation and support our mission, please reach out to us at:
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <a href="mailto:snigmayfoundation@gmail.com" className="text-primary hover:underline">
                    snigmayfoundation@gmail.com
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Our team will get back to you with detailed information about donation methods and documentation for tax benefits.
                </p>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  All donations are tax-deductible under Section 80G of the Income Tax Act. Documentation will be provided upon request.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto">
          <h3 className="section-subheading text-center mb-12">
            Donor Benefits
          </h3>
          <div
            ref={benefitsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto"
          >
            {donorBenefits.map((benefit, index) => (
              <Card 
                key={index} 
                className={`animate-on-scroll transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-primary/10 hover:border-primary/30 bg-gradient-to-br from-white to-primary/5 dark:from-gray-800 dark:to-primary/10`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
                      {benefit.icon}
                    </div>
                    <h4 className="font-semibold text-lg leading-tight">{benefit.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
