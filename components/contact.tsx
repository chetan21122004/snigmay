"use client"

import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Contact() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "Address",
      details: "Snigmay Foundation, Pune, Maharashtra, India",
    },
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      title: "Phone",
      details: "+91 XXXXX XXXXX",
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: "Email",
      details: "info@snigmayfoundation.org",
    },
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      title: "Hours",
      details: "Monday - Saturday: 9:00 AM - 6:00 PM",
    },
  ]

  const socialMedia = [
    {
      icon: <Facebook className="h-5 w-5" />,
      name: "Facebook",
      url: "#",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      name: "Instagram",
      url: "#",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      name: "Twitter",
      url: "#",
    },
    {
      icon: <Youtube className="h-5 w-5" />,
      name: "YouTube",
      url: "#",
    },
  ]

  return (
    <section id="contact" ref={ref} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Contact Us</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Get in touch with us to learn more about our programs, make a donation, or explore partnership
            opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <h3 className="section-subheading">Get In Touch</h3>
            <p className="text-muted-foreground mb-6">
              We'd love to hear from you. Fill out the form and our team will get back to you as soon as possible.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className={`animate-on-scroll ${inView ? "visible" : ""}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-bold">{info.title}</h4>
                        <p className="text-sm text-muted-foreground">{info.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="font-bold text-lg mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="Message subject" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" placeholder="Your message" rows={5} />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">Send Message</Button>
            </form>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden h-[400px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242118.14199917082!2d73.72287834316403!3d18.524564859944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1651835325821!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Snigmay Foundation Location"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
