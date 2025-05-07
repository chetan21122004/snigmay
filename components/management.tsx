"use client"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Users, Building } from "lucide-react"

export default function Management() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const boardMembers = [
    {
      name: "Board Member 1",
      role: "Chairperson",
      description: "Experienced sports administrator with 15+ years in football development",
    },
    {
      name: "Board Member 2",
      role: "Secretary",
      description: "Former national player with extensive coaching experience",
    },
    {
      name: "Board Member 3",
      role: "Treasurer",
      description: "Financial expert specializing in non-profit management",
    },
    {
      name: "Board Member 4",
      role: "Director",
      description: "Education specialist focused on sports integration in academics",
    },
    {
      name: "Board Member 5",
      role: "Director",
      description: "Community development expert with focus on youth empowerment",
    },
  ]

  const partners = [
    "Local Government Bodies",
    "Educational Institutions",
    "Corporate Sponsors",
    "Sports Equipment Providers",
    "Healthcare Partners",
    "Media Partners",
  ]

  return (
    <section id="management" ref={ref} className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-8 sm:px-4 ">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Management</h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground">
            Meet the dedicated team behind Snigmay Foundation who work tirelessly to create opportunities for young
            talent.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6">Board Members</h3>
          <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-4xl mx-auto">
            <CarouselContent>
              {boardMembers.map((member, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className={`h-full animate-on-scroll ${inView ? "visible" : ""}`}>
                    <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                        <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                      </div>
                      <h4 className="font-bold text-base sm:text-lg">{member.name}</h4>
                      <p className="text-primary font-medium text-sm sm:text-base">{member.role}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">{member.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 py-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Leadership Team</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Our leadership team brings together expertise in sports management, education, and community development
              to guide our programs and initiatives.
            </p>
            <div className="space-y-3">
              <div className="flex p-2 bg-zinc-200 rounded-2xl  items-start gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Technical Director</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Oversees all coaching and player development programs</p>
                </div>
              </div>
              <div className="flex p-2 bg-zinc-200 rounded-2xl  items-start gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Operations Manager</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Manages day-to-day operations across all centers</p>
                </div>
              </div>
              <div className="flex p-2 bg-zinc-200 rounded-2xl  items-start gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Community Outreach Director</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Leads initiatives to identify and support talent from underserved communities
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Our Partners</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              We collaborate with a wide range of partners who share our vision and help us create greater impact
              through their support.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partners.map((partner, index) => (
                <Card key={index} className={`animate-on-scroll ${inView ? "visible" : ""}`}>
                  <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <span className="font-medium text-xs sm:text-sm">{partner}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">Organizational Structure</h3>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
              <div className="bg-primary text-white p-3 sm:p-4 rounded-lg text-center mb-3">Board of Directors</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="bg-primary/20 p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm">Advisory Committee</div>
                <div className="bg-primary/20 p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm">Executive Team</div>
                <div className="bg-primary/20 p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm">Financial Oversight</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm">Technical Staff</div>
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm">Administrative Staff</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
