"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Star, Users } from "lucide-react"

export default function Achievements() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const achievements = [
    {
      title: "Maharashtra State League",
      description: "Senior Team participation",
      icon: <Trophy className="h-5 w-5 text-secondary" />,
      year: "2023",
    },
    {
      title: "Under 17 State Youth League",
      description: "Champions",
      icon: <Trophy className="h-5 w-5 text-secondary" />,
      year: "2022",
    },
    {
      title: "Pune District League",
      description: "Multiple divisions champions",
      icon: <Trophy className="h-5 w-5 text-secondary" />,
      year: "2021-2023",
    },
    {
      title: "MLA Youth Cup",
      description: "Champions (Under 9 & Under 11)",
      icon: <Trophy className="h-5 w-5 text-secondary" />,
      year: "2022",
    },
    {
      title: "Don Bosco Cup",
      description: "Champions",
      icon: <Trophy className="h-5 w-5 text-secondary" />,
      year: "2023",
    },
    {
      title: "Independence Day Cup",
      description: "Champions (twice)",
      icon: <Trophy className="h-5 w-5 text-secondary" />,
      year: "2022-2023",
    },
    {
      title: "Guru Teg Bahadur Gold Cup",
      description: "Champions",
      icon: <Trophy className="h-5 w-5 text-secondary" />,
      year: "2017-18 & 2024-25",
    },
  ]

  const playerAchievements = [
    {
      category: "Santosh Trophy",
      count: 1,
      icon: <Star className="h-5 w-5 text-secondary" />,
    },
    {
      category: "Nationals (Boys & Girls)",
      count: 10,
      icon: <Medal className="h-5 w-5 text-secondary" />,
    },
    {
      category: "University competitions",
      count: 12,
      icon: <Users className="h-5 w-5 text-secondary" />,
    },
    {
      category: "District competitions",
      count: 25,
      icon: <Medal className="h-5 w-5 text-secondary" />,
    },
  ]

  const successStories = [
    {
      name: "Sumit Bhandari",
      description: "Professional player with national recognition",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      name: "Tanaya Gaikwad",
      description: "Significant career development opportunities",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      name: "Ipsita Gawari",
      description: "Youth National level progression",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
  ]

  const [visibleAchievements, setVisibleAchievements] = useState(4)

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setVisibleAchievements((prev) => {
          if (prev < achievements.length) {
            return prev + 1
          }
          clearInterval(interval)
          return prev
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [inView, achievements.length])

  return (
    <section id="achievements" ref={ref} className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-heading">Our Achievements</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-2 mb-4"></div>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Celebrating our success stories and milestones that showcase our commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Player Stats - Left Column */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xl font-bold text-center lg:text-left border-b border-gray-200 dark:border-gray-700 pb-2">
              Player Stats
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {playerAchievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`border-none shadow-md hover:shadow-lg transition-shadow ${
                    inView ? "animate-fade-in" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {achievement.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{achievement.count}</p>
                      <p className="text-sm text-muted-foreground">{achievement.category}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Achievements - Middle Column */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold text-center border-b border-gray-200 dark:border-gray-700 pb-2">
              Team Achievements
            </h3>
            
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 styled-scrollbar">
              {achievements.slice(0, visibleAchievements).map((achievement, index) => (
                <Card
                  key={index}
                  className={`border-none shadow-md hover:shadow-lg transition-shadow ${
                    inView ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {achievement.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{achievement.title}</h4>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{achievement.year}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Success Stories - Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-bold text-center lg:text-left border-b border-gray-200 dark:border-gray-700 pb-2">
              Success Stories
            </h3>
            
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6">
              <div className="space-y-4">
                {successStories.map((story, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:translate-x-1 transition-transform ${
                      inView ? "animate-fade-in-right" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {story.icon}
                    </div>
                    <div>
                      <h4 className="font-bold">{story.name}</h4>
                      <p className="text-sm text-muted-foreground">{story.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <a href="#" className="text-primary hover:underline text-sm font-medium">
                  Read more success stories →
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx global>{`
          .styled-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .styled-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .styled-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          .styled-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out forwards;
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          .animate-fade-in-right {
            animation: fadeInRight 0.6s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    </section>
  )
}
