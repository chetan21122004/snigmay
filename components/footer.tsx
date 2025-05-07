import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary w-full overflow-hidden text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="/images/snigmaypunefc-logo.png"
                alt="Snigmay Pune FC Logo"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <Image
                src="/images/snimayfoundation-logo.png"
                alt="Snigmay Foundation Logo"
                width={40}
                height={40}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/80 mb-4">
              Snigmay Foundation is a Pune-based non-profit organization focused on nation-building through youth
              development, sports, and women empowerment.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#home" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#programs" className="text-white/80 hover:text-white transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="#achievements" className="text-white/80 hover:text-white transition-colors">
                  Achievements
                </Link>
              </li>
              <li>
                <Link href="#infrastructure" className="text-white/80 hover:text-white transition-colors">
                  Infrastructure
                </Link>
              </li>
              <li>
                <Link href="#support" className="text-white/80 hover:text-white transition-colors">
                  Support Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Programs</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#programs" className="text-white/80 hover:text-white transition-colors">
                  Grassroots Program
                </Link>
              </li>
              <li>
                <Link href="#programs" className="text-white/80 hover:text-white transition-colors">
                  Elite Program
                </Link>
              </li>
              <li>
                <Link href="#programs" className="text-white/80 hover:text-white transition-colors">
                  Residential Program
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  Coach Education
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  Women's Football
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  Community Outreach
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-white/80 mb-4">
              Subscribe to our newsletter to receive updates on our programs, events, and success stories.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-secondary text-primary hover:bg-secondary/90">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Snigmay Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
