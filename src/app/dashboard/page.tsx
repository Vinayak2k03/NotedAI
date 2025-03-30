"use client";
import Calendar from "@/components/calendar/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarIcon, 
  BarChart3Icon, 
  ListTodoIcon, 
  ClockIcon,
  HomeIcon,
  FileTextIcon,
  UsersIcon,
  Settings2Icon,
  LayoutDashboardIcon,
  LogOutIcon,
  BellIcon,
  SearchIcon,
  PlusIcon,
  ChevronRightIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Custom sidebar navigation item component with enhanced hover effect
function NavItem({ href, icon: Icon, label, active }) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 relative overflow-hidden",
        active 
          ? "bg-gradient-to-r from-slate-800/80 to-slate-900/60 text-white font-medium" 
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all"
      )}
    >
      <Icon className={cn("h-4 w-4", active && "text-white")} />
      <span>{label}</span>
      {active && (
        <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-slate-300 to-slate-400"></div>
      )}
    </Link>
  );
}

export default function Dashboard() {
  // Get current date for the welcome message
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long', 
    day: 'numeric'
  });

  // Get current pathname for active state
  const pathname = usePathname();

  // Navigation items
  const navItems = [
    { href: "/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
    { href: "/meeting", icon: UsersIcon, label: "Meetings" },
    { href: "/notes", icon: FileTextIcon, label: "Notes" },
    { href: "/calendar", icon: CalendarIcon, label: "Calendar" },
    { href: "/settings", icon: Settings2Icon, label: "Settings" },
  ];
  
  // State for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto bg-black min-h-screen">
      <div className="mx-auto">
        <div className="flex">
          {/* Enhanced Sidebar with black gradient */}
          <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-gradient-to-b from-black to-slate-900/95 border-r border-slate-800 shadow-sm hidden md:flex md:flex-col">
            {/* Logo and branding with black gradient */}
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/50 transition-transform hover:scale-105 border border-slate-700">
                  <span className="font-bold text-white">N</span>
                </div>
                <span className="font-bold text-xl text-white tracking-tight">NotedAI</span>
              </div>
            </div>
            
            {/* User profile with enhanced styling */}
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-slate-700 shadow-sm">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white">JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-white">John Doe</p>
                  <p className="text-xs text-slate-400">john@example.com</p>
                </div>
              </div>
            </div>
            
            {/* Navigation with improved spacing and hover effects */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
              {navItems.map((item) => (
                <NavItem 
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href}
                />
              ))}
            </div>
            
            {/* Footer with enhanced styling */}
            <div className="p-4 border-t border-slate-800">
              <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800/70 hover:text-slate-100 w-full transition-all duration-200">
                <LogOutIcon className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          </aside>
          
          {/* Main content area with added top navigation bar */}
          <div className="md:ml-64 w-full">
            {/* Top navigation bar with black gradient */}
            <div className="bg-gradient-to-r from-black to-slate-900 border-b border-slate-800 h-16 fixed top-0 right-0 left-0 md:left-64 z-10 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0 hover:bg-slate-800 text-slate-300 hover:text-white">
                  <SearchIcon className="h-4 w-4" />
                </Button>
                <div className="hidden md:block text-xs text-slate-400">
                  {currentDate}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full w-9 h-9 p-0 hover:bg-slate-800 text-slate-300 hover:text-white"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <BellIcon className="h-4 w-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full"></span>
                  </Button>
                  
                  {/* Notification dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-lg shadow-lg shadow-black/30 border border-slate-700 overflow-hidden z-50">
                      <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                        <span className="font-medium text-sm text-white">Notifications</span>
                        <Badge variant="subtle" className="bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 text-xs border border-slate-600">3 new</Badge>
                      </div>
                      <div>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-3 border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                            <p className="text-sm font-medium text-white">New meeting scheduled</p>
                            <p className="text-xs text-slate-400">30 minutes ago</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-2">
                        <Button variant="ghost" size="sm" className="w-full text-xs justify-center text-slate-300 hover:text-white hover:bg-slate-800">
                          View all
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 border-slate-700 hover:border-slate-600 text-white bg-transparent hover:bg-slate-800">
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>New Meeting</span>
                </Button>
              </div>
            </div>
            
            <div className="p-6 pt-24">
              <div className="max-w-7xl">
                <div className="space-y-8">
                  {/* Welcome header with black gradient typography */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                        {greeting}, John
                      </h1>
                      <p className="text-slate-400 mt-1.5">
                        Here's an overview of your schedule and upcoming activities
                      </p>
                    </div>
                    <div className="hidden lg:block">
                      <Button 
                        className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-900 text-white shadow-md hover:shadow-lg shadow-black/20 hover:shadow-black/40 transition-shadow border border-slate-600"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create New Meeting
                      </Button>
                    </div>
                  </div>

                  {/* Stats overview with black gradient cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <Card className="bg-gradient-to-br from-slate-900 to-black hover:shadow-md shadow-black/20 transition-shadow border-slate-800 overflow-hidden group">
                      <CardContent className="flex justify-between items-center p-6 relative">
                        <div className="relative z-10">
                          <p className="text-sm font-medium text-slate-400">Upcoming Meetings</p>
                          <p className="text-3xl font-bold mt-1.5 text-white">4</p>
                        </div>
                        <div className="p-2.5 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl group-hover:scale-110 transition-transform border border-slate-700">
                          <CalendarIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-slate-900 to-black hover:shadow-md shadow-black/20 transition-shadow border-slate-800 overflow-hidden group">
                      <CardContent className="flex justify-between items-center p-6 relative">
                        <div className="relative z-10">
                          <p className="text-sm font-medium text-slate-400">Notes Created</p>
                          <p className="text-3xl font-bold mt-1.5 text-white">12</p>
                        </div>
                        <div className="p-2.5 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl group-hover:scale-110 transition-transform border border-slate-700">
                          <ListTodoIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-slate-900 to-black hover:shadow-md shadow-black/20 transition-shadow border-slate-800 overflow-hidden group">
                      <CardContent className="flex justify-between items-center p-6 relative">
                        <div className="relative z-10">
                          <p className="text-sm font-medium text-slate-400">Hours Saved</p>
                          <p className="text-3xl font-bold mt-1.5 text-white">8.5</p>
                        </div>
                        <div className="p-2.5 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl group-hover:scale-110 transition-transform border border-slate-700">
                          <ClockIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-slate-900 to-black hover:shadow-md shadow-black/20 transition-shadow border-slate-800 overflow-hidden group">
                      <CardContent className="flex justify-between items-center p-6 relative">
                        <div className="relative z-10">
                          <p className="text-sm font-medium text-slate-400">Productivity</p>
                          <p className="text-3xl font-bold mt-1.5 text-white">+24%</p>
                        </div>
                        <div className="p-2.5 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl group-hover:scale-110 transition-transform border border-slate-700">
                          <BarChart3Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Calendar with black gradient card styling */}
                  <Card className="w-full bg-gradient-to-br from-slate-900 to-black shadow-md shadow-black/20 border border-slate-800 rounded-xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-800 flex justify-between items-center">
                      <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                        <CalendarIcon className="h-5 w-5 text-slate-300" />
                        Calendar Overview
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Calendar />
                    </CardContent>
                  </Card>

                  {/* Recent meetings with black gradient styling */}
                  <Card className="w-full bg-gradient-to-br from-slate-900 to-black shadow-md shadow-black/20 border border-slate-800 rounded-xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-800 flex justify-between items-center">
                      <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                        <UsersIcon className="h-5 w-5 text-slate-300" />
                        Recent Meetings
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Recent meeting items with black gradient styling */}
                        {[1, 2, 3].map((meeting) => (
                          <div key={meeting} className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-800/30 transition-colors border border-slate-800 group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-medium shadow-md shadow-black/20 group-hover:scale-105 transition-transform border border-slate-700">
                                M{meeting}
                              </div>
                              <div>
                                <p className="font-medium text-white">Team Sync Meeting {meeting}</p>
                                <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                                  <ClockIcon className="h-3.5 w-3.5" />
                                  Yesterday at 2:30 PM
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 border border-slate-600 hover:border-slate-500 transition-colors">
                                Notes Available
                              </Badge>
                              <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800">
                                <ChevronRightIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}