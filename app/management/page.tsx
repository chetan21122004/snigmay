"use client"

import { motion } from "framer-motion"
import { FaUsers, FaLightbulb, FaHandshake } from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Briefcase, GraduationCap, Heart } from "lucide-react"

export default function Management() {
  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/leadership-bg.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary/70" />
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 sm:px-6 flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl w-full px-4 sm:px-6"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
              Visionary Leadership
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary/90 max-w-3xl mx-auto leading-relaxed">
              Meet the dedicated team of professionals who guide Snigmay Foundation's mission to empower youth through
              sports and education.
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              className="w-full h-12 sm:h-16 md:h-20 lg:h-24 text-white fill-current"
              viewBox="0 0 1440 74"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,74L1320,74C1200,74,960,74,720,74C480,74,240,74,120,74L0,74Z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
              Our Core Values
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-secondary mx-auto mb-4 sm:mb-6" />
            <p className="text-gray-600 max-w-2xl mx-auto px-4 sm:px-6">
              These principles guide our decisions and shape our approach to youth development and community impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaLightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Vision</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Empowering youth through sports excellence and educational innovation.
              </p>
            </motion.div>

            {/* Leadership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaUsers className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Leadership</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Fostering strong leadership skills and personal development in every individual.
              </p>
            </motion.div>

            {/* Collaboration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1 sm:max-w-md lg:max-w-none mx-auto w-full"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FaHandshake className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Collaboration</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Building strong partnerships to create lasting impact in our communities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Board Members */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">Board of Directors</h2>
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground px-4">
              Our board members bring diverse expertise and a shared passion for youth development through sports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {boardMembers.map((member, index) => (
              <Card key={index} className=" overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="aspect-w-1 aspect-h-1 relative bg-gray-100">
                  <Image
                    src={member.image || "/placeholder.svg?height=300&width=300"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium text-xs sm:text-sm md:text-base">{member.role}</p>
                  <p className="mt-2 text-muted-foreground text-xs sm:text-sm md:text-base">{member.bio}</p>
                  <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                    {member.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs sm:text-sm md:text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-primary hover:bg-secondary/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">Advisory Board</h2>
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground px-4">
              Our advisory board provides strategic guidance and specialized expertise to help us achieve our mission.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {advisoryBoard.map((member, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {getIcon(member.area)}
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">{member.name}</h3>
                      <p className="text-primary font-medium text-xs sm:text-sm md:text-base">{member.role}</p>
                      <p className="mt-2 text-muted-foreground text-xs sm:text-sm md:text-base">{member.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Team */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">Executive Team</h2>
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground px-4">
              Our executive team oversees the day-to-day operations and implementation of our programs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {executiveTeam.map((member, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold">{member.name}</h3>
                  <p className="text-primary font-medium text-xs sm:text-sm md:text-base">{member.role}</p>
                  <p className="mt-2 text-xs sm:text-sm md:text-base text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">Organizational Structure</h2>
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground px-4">
              Our organization is structured to ensure efficient operations and maximum impact.
            </p>
          </div>

         <div className=" mx-auto px-2 sm:px-4">
  <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg shadow-sm">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs sm:text-sm md:text-base">
      
      <div className="col-span-2 sm:col-span-3 bg-primary text-white p-3 rounded-lg">
        Board of Directors
      </div>

      <div className="bg-primary/20 p-3 rounded-lg">Advisory Committee</div>
      <div className="bg-primary/20 p-3 rounded-lg">Executive Team</div>
      <div className="bg-primary/20 p-3 rounded-lg">Financial Oversight</div>

      <div className="bg-primary/10 p-3 rounded-lg">Technical Staff</div>
      <div className="bg-primary/10 p-3 rounded-lg">Administrative Staff</div>
      <div className="bg-primary/10 p-3 rounded-lg">Operations Staff</div>

      <div className="bg-primary/5 p-3 rounded-lg">Coaching Staff</div>
      <div className="bg-primary/5 p-3 rounded-lg">Support Staff</div>

    </div>
  </div>
</div>

        </div>
      </section>

    {/* CTA */}
<section className="py-12 w-90 sm:py-16 md:py-20 lg:py-24 mb-2 bg-[#8a0000] text-white">
  <div className="container mx-auto px-4 sm:px-6 text-center">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Join Our Mission</h2>
    <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
      Be a part of transforming young lives through the power of sports and education. Your support can light the path to a brighter future for countless youth. Together, we can inspire, uplift, and make a lasting impact.
    </p>
    <div className="flex flex-row gap-4 justify-center">
      <Button size="lg" className="bg-yellow-400 text-purple-800 hover:bg-yellow-300 font-bold w-full sm:w-auto">
        <Link href="/#support">Donate Now</Link>
      </Button>
      <Button className="bg-white text-indigo-600 hover:bg-zinc-300/90 font-bold w-full sm:w-auto">
        <Link href="/#contact">Contact Us</Link>
      </Button>
    </div>
  </div>
</section>

    </main>
  )
}

// Sample data for board members
const boardMembers = [
  {
    name: "Rajesh Sharma",
    role: "Chairperson",
    bio: "Former national football player with 20+ years of experience in sports administration and youth development.",
    expertise: ["Sports Administration", "Youth Development"],
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Priya Desai",
    role: "Vice Chairperson",
    bio: "Education specialist with extensive experience in integrating sports and academics for holistic development.",
    expertise: ["Education", "Program Development"],
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Vikram Patel",
    role: "Secretary",
    bio: "Former state-level coach with a passion for grassroots football development and talent identification.",
    expertise: ["Coaching", "Talent Development"],
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Anita Kulkarni",
    role: "Treasurer",
    bio: "Financial expert with 15+ years of experience in non-profit management and sustainable funding models.",
    expertise: ["Finance", "Non-profit Management"],
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Sanjay Mehta",
    role: "Director",
    bio: "Corporate leader with expertise in strategic planning and organizational development for sports institutions.",
    expertise: ["Strategic Planning", "Corporate Partnerships"],
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Meera Joshi",
    role: "Director",
    bio: "Women's football advocate with experience in developing programs for girls in underserved communities.",
    expertise: ["Women's Football", "Community Outreach"],
    image: "/placeholder.svg?height=300&width=300",
  },
]

// Sample data for advisory board
const advisoryBoard = [
  {
    name: "Dr. Amit Singh",
    role: "Sports Medicine Advisor",
    bio: "Specializes in sports injuries and rehabilitation for young athletes, ensuring their long-term health and performance.",
    area: "medical",
  },
  {
    name: "Prof. Neha Kapoor",
    role: "Education Advisor",
    bio: "Expert in developing integrated educational curricula that balance academic excellence with athletic development.",
    area: "education",
  },
  {
    name: "Rahul Verma",
    role: "Technical Football Advisor",
    bio: "Former international player with expertise in modern football techniques and training methodologies.",
    area: "sports",
  },
  {
    name: "Sunita Rao",
    role: "Community Development Advisor",
    bio: "Specializes in creating sustainable community sports programs that address social inequality.",
    area: "community",
  },
  {
    name: "Arjun Malhotra",
    role: "Financial Strategy Advisor",
    bio: "Expert in sustainable funding models for non-profit sports organizations and impact investment.",
    area: "business",
  },
  {
    name: "Dr. Leela Nair",
    role: "Nutrition & Wellness Advisor",
    bio: "Specializes in nutrition and wellness programs tailored for young athletes in development stages.",
    area: "medical",
  },
]

// Sample data for executive team
const executiveTeam = [
  {
    name: "Sunil Kumar",
    role: "Chief Executive Officer",
    description: "Oversees all operations and strategic initiatives of the foundation.",
  },
  {
    name: "Deepa Menon",
    role: "Technical Director",
    description: "Leads all coaching and player development programs across centers.",
  },
  {
    name: "Ravi Tiwari",
    role: "Operations Manager",
    description: "Manages day-to-day operations and logistics for all training centers.",
  },
  {
    name: "Anjali Bhatt",
    role: "Community Outreach Director",
    description: "Leads initiatives to identify and support talent from underserved communities.",
  },
]

// Helper function to get icon based on area of expertise
function getIcon(area:any) {
  switch (area) {
    case "medical":
      return <Heart className="h-8 w-8 text-primary" />
    case "education":
      return <GraduationCap className="h-8 w-8 text-primary" />
    case "sports":
      return <Award className="h-8 w-8 text-primary" />
    case "business":
      return <Briefcase className="h-8 w-8 text-primary" />
    case "community":
      return <Users className="h-8 w-8 text-primary" />
    default:
      return <Users className="h-8 w-8 text-primary" />
  }
}
