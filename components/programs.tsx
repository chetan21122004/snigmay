"use client"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SproutIcon as Seedling, Star, Home, Dumbbell, Utensils, UserCheck, GraduationCap, Globe } from "lucide-react"

const ProgramFeature = ({ Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h4 className="font-medium text-base lg:text-lg">{title}</h4>
      <p className="text-sm lg:text-base text-muted-foreground">{description}</p>
    </div>
  </div>
);

const DevelopmentCard = ({ Icon, title, description }) => (
  <Card>
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h4 className="font-bold text-base lg:text-lg mb-2">{title}</h4>
      <p className="text-sm lg:text-base text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);


export default function Programs() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section id="programs" ref={ref} className="py-12 bg-zinc-50 dark:bg-gray-800">
  <div className="container mx-auto px-8 sm:px-4 lg:px-20">
    <div className="text-center mb-16">
      <h2 className="section-heading text-3xl lg:text-4xl">Our Programs & Development</h2>
      <p className="max-w-3xl lg:max-w-4xl mx-auto text-xl lg:text-xl text-muted-foreground">
        We operate through three distinct training modules designed to develop players at every level of their journey.
      </p>
    </div>

    <Tabs defaultValue="grassroots" className="w-full mx-auto">
      <TabsList className="grid w-full grid-cols-3 lg:gap-8">
        <TabsTrigger value="grassroots" className="flex items-center gap-3 lg:text-lg">
          <Seedling className="h-5 w-5 lg:h-6 lg:w-6" />
          <span className="hidden sm:inline">Grassroots</span>
        </TabsTrigger>
        <TabsTrigger value="elite" className="flex items-center gap-3 lg:text-lg">
          <Star className="h-5 w-5 lg:h-6 lg:w-6" />
          <span className="hidden sm:inline">Elite</span>
        </TabsTrigger>
        <TabsTrigger value="residential" className="flex items-center gap-3 lg:text-lg">
          <Home className="h-5 w-5 lg:h-6 lg:w-6" />
          <span className="hidden sm:inline">Residential</span>
        </TabsTrigger>
      </TabsList>

      {/* Grassroots */}
      <TabsContent value="grassroots" className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <Seedling className="h-6 w-6 text-primary" />
              The Grassroots Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">
              Designed for beginners entering the world of football, our Grassroots Program focuses on developing fundamental skills, fostering a love for the game, and introducing children to the joy of team sports.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgramFeature Icon={Dumbbell} title="Basic Skills Development" description="Fundamental football techniques and movement skills" />
              <ProgramFeature Icon={UserCheck} title="Team Building" description="Learning to work together and develop social skills" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Elite */}
      <TabsContent value="elite" className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <Star className="h-6 w-6 text-primary" />
              The Elite Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">
              Focused on professional readiness for players within Pune, our Elite Program provides advanced training, competitive opportunities, and specialized coaching to develop players for higher levels of competition.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgramFeature Icon={Dumbbell} title="Advanced Training" description="Specialized coaching and tactical development" />
              <ProgramFeature Icon={Utensils} title="Athletic Diet" description="Nutrition guidance for optimal performance" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Residential */}
      <TabsContent value="residential" className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <Home className="h-6 w-6 text-primary" />
              The Residential Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">
              A comprehensive PAN-India professional player development system, our Residential Program provides full-time training, education, accommodation, and holistic development for the most promising young talents from across the country.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgramFeature Icon={GraduationCap} title="Quality Education" description="Academic support alongside football development" />
              <ProgramFeature Icon={Globe} title="National & International Exposure" description="Opportunities to compete at higher levels and gain visibility" />
              <ProgramFeature Icon={UserCheck} title="Personal Mentorship" description="Individual guidance for personal and professional development" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {/* Holistic Approach Section */}
    <div className="mt-24 mx-auto">
      <h3 className="section-subheading text-center text-2xl lg:text-3xl mb-12">Our Holistic Development Approach</h3>
      <div className={`grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-10 animate-on-scroll ${inView ? "visible" : ""}`}>
        <DevelopmentCard Icon={Dumbbell} title="Expert Coaching" description="Professional training from experienced coaches" />
        <DevelopmentCard Icon={Utensils} title="Athletic Diet" description="Nutritional guidance for optimal performance" />
        <DevelopmentCard Icon={UserCheck} title="Mentorship" description="Personal guidance for growth and development" />
        <DevelopmentCard Icon={GraduationCap} title="Education" description="Quality academic support alongside training" />
        <DevelopmentCard Icon={Globe} title="Exposure" description="National and international competitive opportunities" />
      </div>
    </div>
  </div>
</section>

  )
}
