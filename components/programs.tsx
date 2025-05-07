"use client"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SproutIcon as Seedling, Star, Home, Dumbbell, Utensils, UserCheck, GraduationCap, Globe } from "lucide-react"

export default function Programs() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section id="programs" ref={ref} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Our Programs & Development</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            We operate through three distinct training modules designed to develop players at every level of their
            journey.
          </p>
        </div>

        <Tabs defaultValue="grassroots" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grassroots" className="flex items-center gap-2">
              <Seedling className="h-4 w-4" />
              <span className="hidden sm:inline">Grassroots</span>
            </TabsTrigger>
            <TabsTrigger value="elite" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Elite</span>
            </TabsTrigger>
            <TabsTrigger value="residential" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Residential</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grassroots" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Seedling className="h-5 w-5 text-primary" />
                  The Grassroots Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Designed for beginners entering the world of football, our Grassroots Program focuses on developing
                  fundamental skills, fostering a love for the game, and introducing children to the joy of team sports.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Dumbbell className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Basic Skills Development</h4>
                      <p className="text-sm text-muted-foreground">
                        Fundamental football techniques and movement skills
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Team Building</h4>
                      <p className="text-sm text-muted-foreground">
                        Learning to work together and develop social skills
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="elite" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  The Elite Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Focused on professional readiness for players within Pune, our Elite Program provides advanced
                  training, competitive opportunities, and specialized coaching to develop players for higher levels of
                  competition.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Dumbbell className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Advanced Training</h4>
                      <p className="text-sm text-muted-foreground">Specialized coaching and tactical development</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Utensils className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Athletic Diet</h4>
                      <p className="text-sm text-muted-foreground">Nutrition guidance for optimal performance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="residential" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  The Residential Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A comprehensive PAN-India professional player development system, our Residential Program provides
                  full-time training, education, accommodation, and holistic development for the most promising young
                  talents from across the country.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Quality Education</h4>
                      <p className="text-sm text-muted-foreground">Academic support alongside football development</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">National & International Exposure</h4>
                      <p className="text-sm text-muted-foreground">
                        Opportunities to compete at higher levels and gain visibility
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Personal Mentorship</h4>
                      <p className="text-sm text-muted-foreground">
                        Individual guidance for personal and professional development
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="section-subheading text-center mb-8">Our Holistic Development Approach</h3>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-on-scroll ${inView ? "visible" : ""}`}
          >
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-base mb-2">Expert Coaching</h4>
                <p className="text-sm text-muted-foreground">Professional training from experienced coaches</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-base mb-2">Athletic Diet</h4>
                <p className="text-sm text-muted-foreground">Nutritional guidance for optimal performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-base mb-2">Mentorship</h4>
                <p className="text-sm text-muted-foreground">Personal guidance for growth and development</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-base mb-2">Education</h4>
                <p className="text-sm text-muted-foreground">Quality academic support alongside training</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-base mb-2">Exposure</h4>
                <p className="text-sm text-muted-foreground">National and international competitive opportunities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
