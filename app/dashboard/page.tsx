"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, type User } from "@/lib/auth"
import { AuthGuard } from "@/components/auth-guard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { CoachDashboard } from "@/components/coach-dashboard"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }
    loadUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case "super_admin":
        return <AdminDashboard />;
      case "club_manager":
        // Will be implemented later
        return <div>Club Manager Dashboard</div>;
      case "head_coach":
        // Will be implemented later
        return <div>Head Coach Dashboard</div>;
      case "coach":
        return <CoachDashboard />;
      case "center_manager":
        // Will be implemented later
        return <div>Center Manager Dashboard</div>;
      default:
        return <div>Unknown role</div>;
    }
  };

  return <AuthGuard>{renderDashboard()}</AuthGuard>
}
