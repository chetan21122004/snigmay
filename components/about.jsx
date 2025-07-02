"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Heart, Award, Users2, Briefcase, Target, Eye, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "react-intersection-observer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

export default function About() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const statsRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const isMobile = useIsMobile();

  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
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
        }
      );

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
        }
      );

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
        }
      );

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
        }
      );

      // Animate the stats with counter effect
      const counterElements =
        statsRef.current?.querySelectorAll("[data-counter]") || [];

      counterElements.forEach((element) => {
        const target = Number.parseInt(
          element.getAttribute("data-counter-target") || "0",
          10
        );

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
              element.innerText = Math.floor(this.targets()[0].innerText);
            },
          }
        );
      });

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
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-6 md:py-14 bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="section-heading text-2xl md:text-3xl font-bold">About Snigmay Foundation</h2>
          <p className="max-w-3xl mx-auto text-base md:text-lg text-muted-foreground mt-4">
            A Pune-based NGO dedicated to nation building through youth development
            and empowering young lives through the beautiful game of football.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div ref={textRef} className="space-y-6 order-2 md:order-1">
            <div className="mb-4">
              {isMobile ? (
                <div className="space-y-4">
                  <Card className="border border-primary/20 shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Eye className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="text-lg font-semibold">Our Vision</h4>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm md:text-base font-medium text-foreground">
                          "To create the best youth development academy in India"
                        </p>
                        <p className="text-sm md:text-base font-medium text-foreground">
                          "To create an ecosystem in football where talented youth gets an opportunity to shape up as a professional player representing India"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-primary/20 shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="text-lg font-semibold">Our Mission</h4>
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground">
                        By combining sport, education, and life skills training, we create safe
                        and inclusive spaces for young boys and girls to grow, lead, and thrive in their life with sports at the centre of it. Our
                        mission is to foster personal development, teamwork, and help create a unique & dominant presence of Indian football at
                        global level.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid gap-6">
                  <Card className="border-2 border-primary/20 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Eye className="h-6 w-6 text-primary" />
                        <h4 className="text-xl font-semibold">Our Vision</h4>
                      </div>
                      <div className="space-y-3">
                        <p className="text-lg font-medium text-foreground">
                          "To create the best youth development academy in India"
                        </p>
                        <p className="text-lg font-medium text-foreground">
                          "To create an ecosystem in football where talented youth gets an opportunity to shape up as a professional player representing India"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-primary/20 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="h-6 w-6 text-primary" />
                        <h4 className="text-xl font-semibold">Our Mission</h4>
                      </div>
                      <p className="text-muted-foreground">
                        By combining sport, education, and life skills training, we create safe
                        and inclusive spaces for young boys and girls to grow, lead, and thrive in their life with sports at the centre of it. Our
                        mission is to foster personal development, teamwork, and help create a unique & dominant presence of Indian football at
                        global level.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
          <div
            ref={imageRef}
            className="relative h-[220px] md:h-[400px] rounded-lg overflow-hidden shadow-md order-1 md:order-2 mb-6 md:mb-0"
          >
            <Image
              src="/images/teams-collage.png"
              alt="Snigmay Football Teams"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        {isMobile ? (
          <div className="grid grid-cols-2 gap-3 my-8">
            <div className="border border-primary/20 rounded-lg p-3 text-center shadow-sm">
              <div className="text-xl font-bold text-primary">
                1000<span className="text-lg">+</span>
              </div>
              <div className="text-xs">Families Impacted</div>
            </div>
            <div className="border border-primary/20 rounded-lg p-3 text-center shadow-sm">
              <div className="text-xl font-bold text-primary">
                10
              </div>
              <div className="text-xs">Training Centers</div>
            </div>
            <div className="border border-primary/20 rounded-lg p-3 text-center shadow-sm">
              <div className="text-xl font-bold text-primary">
                10<span className="text-lg">+</span>
              </div>
              <div className="text-xs">Years of Experience</div>
            </div>
            <div className="border border-primary/20 rounded-lg p-3 text-center shadow-sm">
              <div className="text-xl font-bold text-primary">
                3000<span className="text-lg">+</span>
              </div>
              <div className="text-xs">Players Trained</div>
            </div>
          </div>
        ) : (
          <div ref={statsRef} className="flex flex-wrap justify-center items-center gap-4 md:gap-16 my-12">
            <div className="text-center px-2">
              <div className="counter-value text-xl md:text-2xl font-bold text-primary">
                <span data-counter data-counter-target="1000">
                  0
                </span>
                +
              </div>
              <div className="counter-label text-sm md:text-base">Families Impacted</div>
            </div>
            <div className="text-center px-2">
              <div className="counter-value text-xl md:text-2xl font-bold text-primary">
                <span data-counter data-counter-target="10">
                  0
                </span>
              </div>
              <div className="counter-label text-sm md:text-base">Training Centers</div>
            </div>
            <div className="text-center px-2">
              <div className="counter-value text-xl md:text-2xl font-bold text-primary">
                <span data-counter data-counter-target="10">
                  0
                </span>
                +
              </div>
              <div className="counter-label text-sm md:text-base">Years of Experience</div>
            </div>
            <div className="text-center px-2">
              <div className="counter-value text-xl md:text-2xl font-bold text-primary">
                <span data-counter data-counter-target="3000">
                  0
                </span>
                +
              </div>
              <div className="counter-label text-sm md:text-base">Players Trained</div>
            </div>
          </div>
        )}
        
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="section-heading text-2xl md:text-3xl font-bold">Problem Statement</h2>
            <p className="max-w-3xl mx-auto text-base md:text-lg text-muted-foreground mt-4">
              Key challenges we're addressing in youth football development
            </p>
          </div>
          
          {isMobile ? (
            <div className="space-y-4">
              <Card className="border border-primary/20 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users2 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">01. Social Inequality</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Many underprivileged children lack access to quality football coaching and opportunities to showcase their talent.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-primary/20 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">02. Limited Resources</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Few organisations have the necessary infrastructure, training facilities, and resources to support these children.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-primary/20 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">03. Missed Potential</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Without proper guidance, these children may not have the opportunity to develop their skills and pursue a career in football.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-primary/20 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">04. Lack of Visibility</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Many still don't know that playing professional football can be a rewarding & flourishing career even in India.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" ref={cardsRef}>
              <Card className={`animate-on-scroll ${inView ? "visible" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
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
                  <div className="flex items-center justify-center mb-4">
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
                  <div className="flex items-center justify-center mb-4">
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
                  <div className="flex items-center justify-center mb-4">
                    <Eye className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">04. Lack of Visibility</h3>
                  <p className="text-muted-foreground">
                    Many still don't know that playing professional football can be a rewarding & flourishing career even in India.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <div>
          <div className="text-center mb-8">
            <h2 className="section-heading text-2xl md:text-3xl font-bold">Our Goals & Objectives</h2>
            <p className="max-w-3xl mx-auto text-base md:text-lg text-muted-foreground mt-4">
              How we're creating lasting change through football
            </p>
          </div>
          
          {isMobile ? (
            <div className="space-y-4">
              <Card className="border border-primary/20 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">01. Skill Development</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We aim to provide comprehensive football training to underprivileged children, helping them develop their skills and reach their full potential.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-primary/20 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">02. Social Inclusion</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Through football, we strive to create a more inclusive society, breaking down barriers based on socio-economic backgrounds.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-primary/20 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">03. Empowerment</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By equipping these children with life skills and self-confidence, we aim to empower them to overcome challenges and succeed in all aspects of life.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`animate-on-scroll ${inView ? "visible" : ""}`} ref={ref}>
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
          )}
        </div>
      </div>
    </section>
  );
}
