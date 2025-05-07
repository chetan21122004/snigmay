"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  const [visibleAchievements, setVisibleAchievements] = useState(3)

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
      }, 300)

      return () => clearInterval(interval)
    }
  }, [inView, achievements.length])

  return (
    <section id="achievements" ref={ref} className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Our Achievements</h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Celebrating our success stories and milestones that showcase our commitment to excellence.
          </p>
        </div>

        <Tabs defaultValue="team" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team">Team Achievements</TabsTrigger>
            <TabsTrigger value="players">Player Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-6">
            <div className="space-y-4">
              {achievements.slice(0, visibleAchievements).map((achievement, index) => (
                <Card
                  key={index}
                  className={`animate-on-scroll ${inView ? "visible" : ""}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{achievement.title}</h4>
                        <p className="text-muted-foreground">{achievement.description}</p>
                        <p className="text-sm text-primary font-medium mt-1">{achievement.year}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="players" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {playerAchievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`animate-on-scroll ${inView ? "visible" : ""}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{achievement.category}</h4>
                        <p className="text-3xl font-bold text-primary">{achievement.count}</p>
                        <p className="text-sm text-muted-foreground">Players represented</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Featured Success Stories</h3>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg flex-shrink-0 flex items-center justify-center w-16 h-16">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Sumit Bhandari</h4>
                    <p className="text-muted-foreground">
                      Joined at 16 and developed into a professional player with national recognition
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg flex-shrink-0 flex items-center justify-center w-16 h-16">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Tanaya Gaikwad</h4>
                    <p className="text-muted-foreground">
                      Her experience with the girls' team led to significant career development opportunities
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg flex-shrink-0 flex items-center justify-center w-16 h-16">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Ipsita Gawari</h4>
                    <p className="text-muted-foreground">
                      Rapid progression to Youth National level through our development program
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
