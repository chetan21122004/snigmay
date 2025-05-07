import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Briefcase, GraduationCap, Heart } from "lucide-react"

export default function ManagementPage() {
  return (
    <main className="pt-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Leadership</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Meet the dedicated team of professionals who guide Snigmay Foundation's mission to empower youth through
            sports and education.
          </p>
        </div>
      </section>

      {/* Board Members */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading">Board of Directors</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Our board members bring diverse expertise and a shared passion for youth development through sports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden h-full">
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={member.image || "/placeholder.svg?height=300&width=300"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                  <p className="mt-2 text-muted-foreground">{member.bio}</p>
                  <div className="mt-4 flex items-center gap-2">
                    {member.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent 
                        bg-secondary text-primary hover:bg-secondary/80"
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
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading">Advisory Board</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Our advisory board provides strategic guidance and specialized expertise to help us achieve our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advisoryBoard.map((member, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {getIcon(member.area)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <p className="text-primary font-medium">{member.role}</p>
                      <p className="mt-2 text-muted-foreground">{member.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading">Executive Team</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Our executive team oversees the day-to-day operations and implementation of our programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {executiveTeam.map((member, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading">Organizational Structure</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Our organization is structured to ensure efficient operations and maximum impact.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md">
                  <div className="bg-primary text-white p-4 rounded-lg text-center mb-4">Board of Directors</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-primary/20 p-3 rounded-lg text-center">Advisory Committee</div>
                    <div className="bg-primary/20 p-3 rounded-lg text-center">Executive Team</div>
                    <div className="bg-primary/20 p-3 rounded-lg text-center">Financial Oversight</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-center">Technical Staff</div>
                    <div className="bg-primary/10 p-3 rounded-lg text-center">Administrative Staff</div>
                    <div className="bg-primary/10 p-3 rounded-lg text-center">Operations Staff</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-primary/5 p-3 rounded-lg text-center">Coaching Staff</div>
                    <div className="bg-primary/5 p-3 rounded-lg text-center">Support Staff</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Support our work to empower youth through sports and education. Together, we can make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold">
              <Link href="/#support">Donate Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-primary  hover:text-primary/85  font-bold">
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
function getIcon(area: string) {
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
