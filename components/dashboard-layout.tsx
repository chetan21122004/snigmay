"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useCenterContext } from "@/context/center-context"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  CreditCard,
  UserCog,
  MapPin,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Role-based menu items according to context.md specifications
const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics",
    roles: ["super_admin", "club_manager", "head_coach", "coach", "center_manager"]
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
    description: "Manage student records",
    roles: ["super_admin", "club_manager", "head_coach", "coach", "center_manager"]
  },
  {
    title: "Batches",
    href: "/batches",
    icon: ClipboardList,
    description: "Training groups",
    roles: ["super_admin", "club_manager", "head_coach", "coach", "center_manager"]
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: Calendar,
    description: "Track attendance",
    roles: ["super_admin", "club_manager", "head_coach", "coach", "center_manager"]
  },
  {
    title: "Fees",
    href: "/fees",
    icon: CreditCard,
    description: "Payment management",
    roles: ["super_admin", "club_manager", "head_coach", "coach", "center_manager"]
  },
  {
    title: "Staff Management",
    href: "/user-management",
    icon: UserCog,
    description: "Manage coaches & staff",
    roles: ["super_admin", "club_manager", "head_coach"], // Only higher-level roles can manage users
  },
]

// Professional center selector component
const CenterSelector = () => {
  const { selectedCenter, setSelectedCenter, centers, loading } = useCenterContext()

  if (loading) {
    return (
      <div className="p-4 border-b border-gray-100">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    )
  }

  if (centers.length === 0) {
    return (
      <div className="p-4 border-b border-gray-100">
        <div className="text-center py-4">
          <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No centers available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Training Center
        </label>
        <Select 
          value={selectedCenter?.id || ""} 
          onValueChange={(value) => {
            const center = centers.find(c => c.id === value)
            setSelectedCenter(center || null)
          }}
        >
          <SelectTrigger className="w-full h-10 bg-white border-gray-200 shadow-sm hover:border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500/20">
            <SelectValue placeholder="Select center" />
          </SelectTrigger>
          <SelectContent>
            {centers.map((center) => (
              <SelectItem key={center.id} value={center.id} className="py-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-burgundy-500" />
                  <span className="font-medium">{center.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Professional sidebar component
const Sidebar = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {
  const { user } = useCenterContext()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true
    if (!user) return false
    return item.roles.includes(user.role)
  })

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 shadow-lg",
      collapsed ? "w-16" : "w-72"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-gray-100",
          collapsed ? "px-3" : "px-4"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Image
                src="/snigmay_logo.png"
                alt="Snigmay Pune FC"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Snigmay Pune FC</h2>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Center Selector */}
        {!collapsed && <CenterSelector />}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                "text-gray-700 hover:text-burgundy-900 hover:bg-burgundy-50",
                "focus:outline-none focus:ring-2 focus:ring-burgundy-500/20",
                collapsed ? "justify-center" : ""
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                "text-gray-500 group-hover:text-burgundy-600"
              )} />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500 truncate">{item.description}</div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className={cn(
          "p-4 border-t border-gray-100 bg-gray-50/50",
          collapsed ? "px-3" : "px-4"
        )}>
          {collapsed ? (
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-semibold">
                  {user?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full p-0 h-auto hover:bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3 p-2 w-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-semibold">
                        {user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.full_name || 'Loading...'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-burgundy-100 text-burgundy-700">
                          {user?.role ? user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Loading...'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/change-password">
                    <Settings className="mr-2 h-4 w-4" />
                    Change Password
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}

// Professional header component
const Header = ({ collapsed, onMenuToggle }: { collapsed: boolean; onMenuToggle: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Header */}
      <header className={cn(
        "sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300",
        collapsed ? "ml-16" : "ml-72"
      )}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden h-9 w-9 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-72 bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Sidebar collapsed={false} onToggle={() => {}} />
          </div>
        </div>
      )}
    </>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      
      {/* Header */}
      <Header collapsed={collapsed} onMenuToggle={() => setCollapsed(!collapsed)} />

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        collapsed ? "ml-16" : "ml-72"
      )}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 