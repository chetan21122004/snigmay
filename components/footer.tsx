import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-primary via-primary/95 to-primary text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="relative container mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src="/images/snimayfoundation-logo.png"
                alt="Snigmay Foundation Logo"
                width={40}
                height={40}
                className="h-20 w-auto hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Snigmay Foundation is a Pune-based non-profit organization focused on nation-building through youth
              development, sports, and women empowerment.
            </p>
            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>Pune, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Phone className="h-4 w-4 text-secondary" />
                <span>+91 XXX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Mail className="h-4 w-4 text-secondary" />
                <span>contact@snigmay.org</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Youtube, label: "YouTube", href: "#" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transform hover:-translate-y-1 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl relative after:content-[''] after:block after:w-12 after:h-1 after:bg-secondary after:mt-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                "Home",
                "About Us",
                "Programs",
                "Achievements",
                "Infrastructure",
                "Support Us",
                "Contact",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-white/80 hover:text-secondary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="h-1 w-2 bg-secondary group-hover:w-4 transition-all duration-300" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Section */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl relative after:content-[''] after:block after:w-12 after:h-1 after:bg-secondary after:mt-2">
              Our Programs
            </h3>
            <ul className="space-y-3">
              {[
                "Grassroots Program",
                "Elite Program",
                "Residential Program",
                "Coach Education",
                "Women's Football",
                "Community Outreach",
              ].map((program) => (
                <li key={program}>
                  <Link
                    href="#programs"
                    className="text-white/80 hover:text-secondary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="h-1 w-2 bg-secondary group-hover:w-4 transition-all duration-300" />
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl relative after:content-[''] after:block after:w-12 after:h-1 after:bg-secondary after:mt-2">
              Stay Connected
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Subscribe to our newsletter to receive updates on our programs, events, and success stories.
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all duration-300"
              />
              <Button className="w-full bg-secondary text-primary hover:bg-secondary/90 transition-colors duration-300 font-semibold">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>&copy; {new Date().getFullYear()} Snigmay Foundation. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-secondary transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
