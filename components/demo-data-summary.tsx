"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DemoDataSummary() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Football Academy Demo Data</h1>
        <p className="text-gray-600">Complete test dataset for the attendance management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-gray-600">1 Admin + 4 Coaches</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs text-gray-600">Different age groups</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40</div>
            <div className="text-xs text-gray-600">Ages 6-35</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150+</div>
            <div className="text-xs text-gray-600">3 weeks of data</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Demo Login Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Admin Account</h4>
                <Badge variant="default">Admin</Badge>
              </div>
              <p className="text-sm text-gray-600">Email: admin@academy.com</p>
              <p className="text-sm text-gray-600">Password: password123</p>
              <p className="text-xs text-gray-500 mt-2">Full access to all features</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Coach Accounts</h4>
              {[
                { name: "John Martinez", email: "john.coach@academy.com", batches: "Under 8, Under 12" },
                { name: "Sarah Johnson", email: "sarah.coach@academy.com", batches: "Under 10, Girls U12" },
                { name: "Mike Thompson", email: "mike.coach@academy.com", batches: "Under 15, Adult Rec" },
                { name: "Lisa Rodriguez", email: "lisa.coach@academy.com", batches: "Under 18" },
              ].map((coach, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-sm">{coach.name}</h5>
                    <Badge variant="secondary">Coach</Badge>
                  </div>
                  <p className="text-xs text-gray-600">Email: {coach.email}</p>
                  <p className="text-xs text-gray-600">Password: password123</p>
                  <p className="text-xs text-gray-500">Batches: {coach.batches}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Batch Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Under 8 Beginners", students: 5, coach: "John Martinez", ages: "6-8" },
              { name: "Under 10 Development", students: 6, coach: "Sarah Johnson", ages: "8-10" },
              { name: "Under 12 Competitive", students: 7, coach: "John Martinez", ages: "10-12" },
              { name: "Under 15 Elite", students: 6, coach: "Mike Thompson", ages: "13-15" },
              { name: "Under 18 Academy", students: 5, coach: "Lisa Rodriguez", ages: "16-18" },
              { name: "Girls Under 12", students: 5, coach: "Sarah Johnson", ages: "10-12" },
              { name: "Adult Recreational", students: 6, coach: "Mike Thompson", ages: "25-35" },
            ].map((batch, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <h5 className="font-medium text-sm">{batch.name}</h5>
                  <Badge variant="outline">{batch.students} students</Badge>
                </div>
                <p className="text-xs text-gray-600">Coach: {batch.coach}</p>
                <p className="text-xs text-gray-500">Ages: {batch.ages}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Admin Testing</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create/edit/delete batches</li>
                <li>• Manage coach assignments</li>
                <li>• Add/remove students</li>
                <li>• View comprehensive reports</li>
                <li>• Export attendance data</li>
                <li>• Filter reports by batch/date/student</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Coach Testing</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mark daily attendance</li>
                <li>• View assigned batches only</li>
                <li>• See attendance history</li>
                <li>• Update existing attendance</li>
                <li>• Add students to batches</li>
                <li>• View attendance statistics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Data Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Realistic Names</h4>
              <p className="text-xs text-gray-600">
                Students and coaches have realistic names and contact information for testing
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Attendance Patterns</h4>
              <p className="text-xs text-gray-600">
                3 weeks of attendance data with realistic absence patterns (~10-15% absent rate)
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Age Groups</h4>
              <p className="text-xs text-gray-600">
                Multiple age groups from youth (6-8) to adult recreational (25-35) players
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
