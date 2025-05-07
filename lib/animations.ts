"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function setupScrollAnimations() {
  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }

    // Get all elements with the animate-on-scroll class
    const animatedElements = document.querySelectorAll(".animate-on-scroll")

    // Create animations for each element
    animatedElements.forEach((element, index) => {
      // Calculate a slight delay based on the element's index
      const delay = index * 0.1

      // Create the GSAP animation
      gsap.fromTo(
        element,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%", // Start animation when the top of the element is 80% from the top of the viewport
            toggleActions: "play none none none", // Play animation once when scrolled into view
          },
        },
      )
    })

    // Create animations for counter elements
    const counterElements = document.querySelectorAll("[data-counter]")

    counterElements.forEach((element) => {
      const target = Number.parseInt(element.getAttribute("data-counter-target") || "0", 10)
      const prefix = element.getAttribute("data-counter-prefix") || ""
      const suffix = element.getAttribute("data-counter-suffix") || ""

      gsap.fromTo(
        element,
        { innerText: "0" },
        {
          innerText: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 1 }, // Snap to integer values
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
          },
          onUpdate: function () {
            // @ts-ignore
            element.innerText = `${prefix}${Math.floor(this.targets()[0].innerText)}${suffix}`
          },
        },
      )
    })

    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])
}
