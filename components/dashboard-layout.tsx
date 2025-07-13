"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signOut, getCurrentUser, type User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  CreditCard,
  UserCog,
  Menu,
  LogOut,
  Lock,
  User as UserIcon,
  Building,
  ClipboardList,
  Settings,
  Bell,
  ChevronRight,
  HelpCircle,
  Database,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CenterProvider, useCenterContext } from "@/context/center-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface MenuItem {
  title: string
  href: string
  icon: any
  roles?: string[]
}

// Simplified menu items - only essential features
const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
  },
  {
    title: "Batches",
    href: "/batches",
    icon: ClipboardList,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: Calendar,
  },
  {
    title: "Fees",
    href: "/fees",
    icon: CreditCard,
  },
  {
    title: "Coach Management",
    href: "/user-management",
    icon: UserCog,
    roles: ["super_admin", "club_manager", "head_coach"],
  },
  {
    title: "Demo Data",
    href: "/demo-data",
    icon: Database,
    roles: ["super_admin"],
  },
];

// Center selector component
const CenterSelector = () => {
  const { selectedCenter, setSelectedCenter, centers, loading } = useCenterContext()

  if (loading) {
    return <div className="h-9 bg-muted animate-pulse rounded-md" />
  }

  return (
    <Select 
      value={selectedCenter?.id || "all"} 
      onValueChange={(value) => {
        if (value === "all") {
          setSelectedCenter(null)
        } else {
          const center = centers.find(c => c.id === value)
          setSelectedCenter(center || null)
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Center" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Centers</SelectItem>
        {centers.map((center) => (
          <SelectItem key={center.id} value={center.id}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {center.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const DashboardLayoutContent = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      setUser(currentUser)
    } catch (error) {
      console.error("Error loading user:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const getFilteredMenuItems = () => {
    if (!user) return []
    
    return menuItems.filter(item => 
      !item.roles || item.roles.includes(user.role)
    )
  }

  const getUserInitials = () => {
    if (!user?.full_name) return "U"
    return user.full_name
      .split(" ")
      .map(name => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleName = () => {
    if (!user?.role) return "User"
    
    const roleNames: Record<string, string> = {
      super_admin: "Super Admin",
      club_manager: "Club Manager",
      head_coach: "Head Coach",
      coach: "Coach",
      center_manager: "Center Manager"
    }
    
    return roleNames[user.role] || "User"
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-6 border-b">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg">Snigmay</h1>
          <p className="text-xs text-muted-foreground">Sports Academy</p>
        </div>
      </div>

      {/* Center Selector */}
      <div className="px-4 py-4 border-b">
        <p className="text-sm font-medium mb-2">Select Center</p>
        <CenterSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {getFilteredMenuItems().map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-muted hover:text-foreground",
              "text-muted-foreground"
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src="/placeholder-user.jpg" alt={user?.full_name} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground">{getRoleName()}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/change-password">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold">Welcome back, {user?.full_name?.split(' ')[0]}</h2>
              <p className="text-sm text-muted-foreground">{getRoleName()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt={user?.full_name} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <CenterProvider user={null}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </CenterProvider>
  )
} 