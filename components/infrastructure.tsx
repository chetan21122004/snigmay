"use client"

import { useRef } from "react"
import { useInView } from "react-intersection-observer"
import { 
  Landmark, 
  Building, 
  Dumbbell, 
  Stethoscope, 
  MapPin, 
  Users, 
  GraduationCap, 
  Briefcase 
} from "lucide-react"

export default function Infrastructure() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const facilities = [
    {
      title: "Natural 11-a-side ground",
      icon: <Landmark className="h-6 w-6 text-primary" />,
      description: "Professional-grade playing surface for official matches and elite training sessions",
    },
    {
      title: "Artificial 9-a-side ground",
      icon: <Landmark className="h-6 w-6 text-primary" />,
      description: "All-weather training facility enabling year-round development regardless of seasonal conditions",
    },
    {
      title: "Residential complex",
      icon: <Building className="h-6 w-6 text-primary" />,
      description: "State-of-the-art accommodation designed specifically for athletes' comfort and recovery",
    },
    {
      title: "Academic facilities",
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      description: "Modern classrooms and study areas supporting players' educational development alongside athletics",
    },
    {
      title: "High-performance center",
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      description: "Specialized training zones including gym, swimming pool, and strength & conditioning areas",
    },
    {
      title: "Medical facilities",
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
      description: "Comprehensive medical support including rehabilitation equipment and emergency services",
    },
  ]

  const expansionPoints = [
    {
      title: "Multiple Training Centers",
      icon: <MapPin className="h-6 w-6 text-white" />,
      description: "Strategic expansion across multiple locations to maximize accessibility and talent discovery",
    },
    {
      title: "Increased Player Capacity",
      icon: <Users className="h-6 w-6 text-white" />,
      description: "Expanded facilities to accommodate more talented players from diverse backgrounds",
    },
    {
      title: "Enhanced Education Programs",
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      description: "Comprehensive academic curriculum integrated with athletic development",
    },
    {
      title: "Professional Career Pathways",
      icon: <Briefcase className="h-6 w-6 text-white" />,
      description: "Creating clear progression routes to professional football and alternative career opportunities",
    },
  ]

  return (
    <section id="infrastructure" ref={ref} className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Infrastructure & Development</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-2 mb-4"></div>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            Building world-class facilities to nurture talent and create the optimal environment for player development
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Current Infrastructure */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">World-Class Facilities</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {facilities.map((facility, index) => (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 ${
                    inView ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {facility.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{facility.title}</h4>
                      <p className="text-sm text-muted-foreground">{facility.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Future Development */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Strategic Expansion</h3>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-8 mb-8 shadow-lg">
              <h4 className="text-xl font-bold mb-4">Our Vision</h4>
              <p className="mb-4">
                We're expanding our footprint to create India's premier football development ecosystem, with multiple centers of excellence across the country.
              </p>
              <p>
                This strategic growth will enable us to discover and nurture talent from diverse backgrounds, providing more opportunities for aspiring players nationwide.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expansionPoints.map((point, index) => (
                <div 
                  key={index} 
                  className={`bg-primary/10 dark:bg-primary/20 rounded-xl p-5 ${
                    inView ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${(index + 6) * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      {point.icon}
                    </div>
                    <h4 className="font-bold">{point.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-11">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto text-center">
          <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 ${
            inView ? "animate-fade-in-up" : "opacity-0"
          }`} style={{ animationDelay: "1000ms" }}>
            <h3 className="text-2xl font-bold mb-4">Partner With Us</h3>
            <p className="text-muted-foreground mb-6">
              Join us in building the future of Indian football by supporting our infrastructure development initiatives. 
              Together, we can create opportunities for talented young players across the nation.
            </p>
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Become a Supporter
            </button>
          </div>
        </div>

        <style jsx global>{`
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </section>
  )
}
