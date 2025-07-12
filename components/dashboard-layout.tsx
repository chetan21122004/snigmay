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
  BarChart3,
  Settings,
  Bell,
  ChevronRight,
  HelpCircle,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface Center {
  id: string
  name: string
  location: string
}

interface MenuItem {
  title: string
  href: string
  icon: any
  roles?: string[]
  badge?: string;
}

// Group menu items by category
interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ]
  },
  {
    title: "Management",
    items: [
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
        title: "Coaches",
        href: "/coaches",
        icon: GraduationCap,
        roles: ["super_admin", "club_manager", "head_coach"],
      },
      {
        title: "Centers",
        href: "/centers",
        icon: Building,
        roles: ["super_admin", "club_manager"],
      },
    ]
  },
  {
    title: "Operations",
    items: [
      {
        title: "Attendance",
        href: "/attendance",
        icon: Calendar,
      },
      {
        title: "Fee Management",
        href: "/fees",
        icon: CreditCard,
        badge: "New",
      },
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
    ]
  },
  {
    title: "Administration",
    items: [
      {
        title: "User Management",
        href: "/user-management",
        icon: UserCog,
        roles: ["super_admin"],
      },
      {
        title: "Demo Data",
        href: "/demo-data",
        icon: Database,
        roles: ["super_admin"],
      },
    ]
  }
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [centers, setCenters] = useState<Center[]>([])
  const [selectedCenter, setSelectedCenter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<number>(3) // Example notification count
  const router = useRouter()

  useEffect(() => {
    loadUserAndCenters()
  }, [])

  const loadUserAndCenters = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      setUser(currentUser)

      // Fetch centers
      const response = await fetch("/api/centers")
      const centersData = await response.json()
      setCenters(centersData)

      // Set default center based on user role
      if (currentUser.role === "coach" || currentUser.role === "center_manager") {
        setSelectedCenter(currentUser.center_id || "all")
      } else {
        setSelectedCenter(localStorage.getItem("selectedCenter") || "all")
      }
    } catch (error) {
      console.error("Error loading user and centers:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleCenterChange = (centerId: string) => {
    setSelectedCenter(centerId)
    localStorage.setItem("selectedCenter", centerId)
    // Reload the page to update data based on selected center
    window.location.reload()
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const getFilteredMenuCategories = () => {
    if (!user) return []
    
    return menuCategories.map(category => {
      const filteredItems = category.items.filter(item => {
        if (!item.roles) return true
        return item.roles.includes(user.role)
      });
      
      return {
        ...category,
        items: filteredItems
      };
    }).filter(category => category.items.length > 0);
  }

  const canSwitchCenter = () => {
    if (!user) return false
    return ["super_admin", "club_manager", "head_coach"].includes(user.role)
  }

  const getUserInitials = () => {
    if (!user) return "U"
    return user.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleName = () => {
    if (!user) return ""
    const roleMap: Record<string, string> = {
      super_admin: "Super Administrator",
      club_manager: "Club Manager",
      head_coach: "Head Coach",
      coach: "Coach",
      center_manager: "Center Manager"
    }
    return roleMap[user.role] || user.role.replace("_", " ")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b flex flex-col items-center md:items-start">
        <div className="flex items-center gap-2 mb-4">
          <Image 
            src="/placeholder-logo.svg" 
            alt="Snigmay Pune FC Logo" 
            width={40} 
            height={40} 
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-primary">Snigmay FC</h1>
            <p className="text-xs text-muted-foreground">Football Academy</p>
          </div>
        </div>
        <div className="w-full p-3 rounded-lg bg-muted/50 flex items-center gap-3">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src="" alt={user?.full_name} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.full_name}</p>
            <p className="text-xs text-muted-foreground">{getRoleName()}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {getFilteredMenuCategories().map((category, idx) => (
          <div key={idx} className="py-2">
            <div className="px-6 py-2">
              <p className="text-xs font-medium text-muted-foreground">{category.title}</p>
            </div>
            <nav className="px-3 space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon
                const isActive = window.location.pathname === item.href
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start rounded-lg",
                        isActive && "bg-primary/10 text-primary font-medium"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge variant="outline" className="ml-auto text-xs bg-primary/10 text-primary border-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </nav>
            {idx < getFilteredMenuCategories().length - 1 && (
              <Separator className="my-2 mx-6" />
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="md:ml-64">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <Sheet>
                  <SheetTrigger asChild className="md:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </Sheet>

                {/* Breadcrumb - simplified example */}
                <div className="hidden sm:flex items-center text-sm">
                  <span className="text-muted-foreground">Snigmay FC</span>
                  <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                  <span className="font-medium">{window.location.pathname.split('/').pop()?.charAt(0).toUpperCase() + window.location.pathname.split('/').pop()?.slice(1) || 'Dashboard'}</span>
                </div>

                {/* Center Selector */}
                {canSwitchCenter() && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedCenter} onValueChange={handleCenterChange}>
                      <SelectTrigger className="w-[200px] h-9 text-sm">
                        <SelectValue placeholder="Select Center" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Centers</SelectItem>
                        {centers.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Fixed Center Display for Coaches */}
                {!canSwitchCenter() && user?.center_id && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="pl-1 pr-2 py-0 flex items-center gap-1 border-green-200 bg-green-50">
                      <Building className="h-3 w-3 text-green-600" />
                      <span className="text-green-700">
                        {centers.find((c) => c.id === user.center_id)?.location || "Center"}
                      </span>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-2">
                {/* Help */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Help & Resources</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Notifications */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                        <Bell className="h-5 w-5" />
                        {notifications > 0 && (
                          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                            {notifications}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src="" alt={user?.full_name} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/change-password" className="cursor-pointer">
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Change Password</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        
        {/* Footer */}
        <footer className="border-t py-4 px-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Snigmay Pune Football Club. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
} 