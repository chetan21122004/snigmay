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
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-4 mb-4">
      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h4 className="font-bold text-xl">{title}</h4>
    </div>
    <p className="text-base text-muted-foreground leading-relaxed">
      {description}
    </p>
  </div>
);


export default function Programs() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section id="programs" ref={ref} className="py-24 bg-gradient-to-b from-zinc-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-8 sm:px-4 lg:px-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center p-1 mb-4 bg-primary/10 rounded-full">
            <span className="px-4 py-1.5 text-sm font-medium text-primary">Our Training Programs</span>
          </div>
            <h2 className="section-heading text-4xl lg:text-5xl font-bold mb-6">How We Help To Develop Professional Career</h2>
          <p className="max-w-3xl lg:max-w-4xl mx-auto text-xl text-muted-foreground">
            We operate through three distinct training modules designed to develop players at every level of their journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Grassroots Program Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-8 lg:p-10">
              <div className="mb-8">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  <Seedling className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">The Grassroots Program</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Designed for beginners entering the world of football, our Grassroots Program focuses on developing fundamental skills, fostering a love for the game, and introducing children to the joy of team sports.
                </p>
              </div>
              <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <ProgramFeature Icon={Dumbbell} title="Basic Skills Development" description="Fundamental football techniques and movement skills" />
                <ProgramFeature Icon={UserCheck} title="Team Building" description="Learning to work together and develop social skills" />
              </div>
            </div>
          </div>

          {/* Elite Program Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-8 lg:p-10">
              <div className="mb-8">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">The Elite Program</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Focused on professional readiness for players within Pune, our Elite Program provides advanced training, competitive opportunities, and specialized coaching to develop players for higher levels of competition.
                </p>
              </div>
              <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <ProgramFeature Icon={Dumbbell} title="Advanced Training" description="Specialized coaching and tactical development" />
                <ProgramFeature Icon={Utensils} title="Athletic Diet" description="Nutrition guidance for optimal performance" />
              </div>
            </div>
          </div>

          {/* Residential Program Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-8 lg:p-10">
              <div className="mb-8">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">The Residential Program</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A comprehensive PAN-India professional player development system, our Residential Program provides full-time training, education, accommodation, and holistic development for the most promising young talents from across the country.
                </p>
              </div>
              <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <ProgramFeature Icon={GraduationCap} title="Quality Education" description="Academic support alongside football development" />
                <ProgramFeature Icon={Globe} title="National & International Exposure" description="Opportunities to compete at higher levels and gain visibility" />
                <ProgramFeature Icon={UserCheck} title="Personal Mentorship" description="Individual guidance for personal and professional development" />
              </div>
            </div>
          </div>
        </div>

        {/* Holistic Approach Section */}
        <div className="pt-16">
          
        
          <h3 className="section-subheading text-center text-3xl lg:text-4xl font-bold mb-16">Our Approach</h3>
          <div 
            className={`flex flex-wrap justify-center gap-8 lg:gap-10 animate-on-scroll ${inView ? "visible" : ""}`}
          >
            <div className="flex-1 min-w-[240px] max-w-[280px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-primary/20 hover:border-primary">
              <DevelopmentCard 
                Icon={Dumbbell} 
                title="Expert Coaching" 
                description="Professional training from experienced coaches" 
              />
            </div>
            <div className="flex-1 min-w-[240px] max-w-[280px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-primary/20 hover:border-primary">
              <DevelopmentCard 
                Icon={Utensils} 
                title="Athletic Diet" 
                description="Nutritional guidance for optimal performance" 
              />
            </div>
            <div className="flex-1 min-w-[240px] max-w-[280px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-primary/20 hover:border-primary">
              <DevelopmentCard 
                Icon={UserCheck} 
                title="Mentorship" 
                description="Personal guidance for growth and development" 
              />
            </div>
            <div className="flex-1 min-w-[240px] max-w-[280px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-primary/20 hover:border-primary">
              <DevelopmentCard 
                Icon={GraduationCap} 
                title="Education" 
                description="Quality academic support alongside training" 
              />
            </div>
            <div className="flex-1 min-w-[240px] max-w-[280px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-primary/20 hover:border-primary">
              <DevelopmentCard 
                Icon={Globe} 
                title="Exposure" 
                description="National and international competitive opportunities" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
