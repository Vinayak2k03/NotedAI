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
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useUser } from "@/components/context/auth-provider";


// Custom sidebar navigation item component with refined hover effect
function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
        active
          ? "bg-slate-800/80 text-white font-medium"
          : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
      )}
    >
      <Icon
        className={cn("h-4 w-4", active ? "text-white" : "text-slate-400")}
      />
      <span>{label}</span>
      {active && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80"></div>
      )}
    </Link>
  );
}

export default function Dashboard() {
  const { current: currentUser } = useUser();

  // Get current date for the welcome message
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Get current pathname for active state
  const pathname = usePathname();

  // Navigation items
  const navItems = [
    { href: "/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
    { href: "/meeting", icon: UsersIcon, label: "Meetings" },
    { href: "/tasks", icon: FileTextIcon, label: "Tasks" },
    { href: "/settings", icon: Settings2Icon, label: "Settings" },
  ];

  // State for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto bg-black min-h-screen">
      <div className="mx-auto">
        <div className="flex">
          {/* Refined sidebar with cleaner gradients */}
          <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-gradient-to-b from-slate-950 to-black border-r border-slate-800/70 hidden md:flex md:flex-col">
            {/* Logo and branding */}
            <div className="p-4 flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center shadow-xl shadow-black/20">
                <span className="font-bold text-white">N</span>
              </div>
              <span className="font-bold text-white tracking-tight">
                NotedAI
              </span>
            </div>

            {/* User profile with modern styling */}
            <div className="px-3 py-4">
              <div className="p-2 rounded-md hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-slate-700">
                    <AvatarImage src={currentUser?.prefs?.avatar || ""} />
                    <AvatarFallback className="bg-slate-800 text-slate-200">
                      {currentUser?.name
                        ? currentUser.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-white">
                      {currentUser?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {currentUser?.email || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refined navigation with improved spacing */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-0.5">
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
          </aside>

          {/* Main content area with refined nav bar */}
          <div className="md:ml-64 w-full">
            {/* Top navigation bar with cleaner gradient */}
            <div className="bg-black border-b border-slate-800/70 h-16 fixed top-0 right-0 left-0 md:left-64 z-10 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="h-9 w-64 rounded-md bg-slate-900/70 border border-slate-700/50 pl-9 pr-4 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600 focus:border-slate-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:block text-xs text-slate-400">
                  {currentDate}
                </div>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md h-8 w-8 bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <BellIcon className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full"></span>
                  </Button>

                  {/* Notification dropdown with modern styling */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 bg-slate-900 rounded-md shadow-xl shadow-black/40 border border-slate-800/80 overflow-hidden z-50">
                      <div className="p-3 flex justify-between items-center">
                        <span className="font-medium text-sm text-white">
                          Notifications
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-white/10 text-white text-xs border-none px-1.5 py-0"
                        >
                          3 new
                        </Badge>
                      </div>
                      <div className="max-h-80 overflow-auto">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="px-3 py-2.5 border-t border-slate-800/80 hover:bg-slate-800/40 transition-colors cursor-pointer"
                          >
                            <div className="flex gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                                <UsersIcon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-200">
                                  New meeting scheduled
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  30 minutes ago
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 border-t border-slate-800/80">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 h-8"
                        >
                          View all notifications
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-2 border-slate-700/50 hover:border-slate-600 text-white bg-transparent hover:bg-slate-800/60 h-8"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>New Meeting</span>
                </Button>

                <Avatar className="h-8 w-8 border border-slate-700/50">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-slate-800 text-slate-200">
                    JD
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="p-6 pt-24">
              <div className="max-w-7xl">
                <div className="space-y-6">
                  {/* Welcome header with clean typography */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-semibold text-white">
                        {greeting}, {currentUser?.name || "Guest"}
                      </h1>
                      <p className="text-slate-400 mt-1">
                        Here's an overview of your meetings and notes
                      </p>
                    </div>
                  </div>

                  {/* Stats overview with modern cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: "Upcoming Meetings",
                        value: "4",
                        icon: CalendarIcon,
                      },
                      {
                        title: "Notes Created",
                        value: "12",
                        icon: ListTodoIcon,
                      },
                      { title: "Hours Saved", value: "8.5", icon: ClockIcon },
                      {
                        title: "Productivity",
                        value: "+24%",
                        icon: BarChart3Icon,
                      },
                    ].map((stat, i) => (
                      <Card
                        key={i}
                        className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <CardContent className="flex justify-between items-center p-6">
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              {stat.title}
                            </p>
                            <p className="text-2xl font-bold mt-1 text-white">
                              {stat.value}
                            </p>
                          </div>
                          <div className="p-2 rounded-md bg-white/5 text-white">
                            <stat.icon className="h-5 w-5" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Two column layout for Calendar and Recent meetings */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendar with modern styling */}
                    <Card className="bg-slate-900 border-slate-800 hover:shadow-lg hover:shadow-black/30 transition-all">
                      <CardHeader className="pb-2 pt-5 px-6 flex justify-between items-center border-b border-slate-800/50">
                        <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-white" />
                          Calendar
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        >
                          View All
                        </Button>
                      </CardHeader>
                      <CardContent className="p-5">
                        <Calendar />
                      </CardContent>
                    </Card>

                    {/* Recent meetings with modern styling */}
                    <Card className="bg-slate-900 border-slate-800 hover:shadow-lg hover:shadow-black/30 transition-all">
                      <CardHeader className="pb-2 pt-5 px-6 flex justify-between items-center border-b border-slate-800/50">
                        <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                          <UsersIcon className="h-4 w-4 text-white" />
                          Recent Meetings
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        >
                          View All
                        </Button>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-slate-800/50">
                          {[1, 2, 3].map((meeting) => (
                            <div
                              key={meeting}
                              className="flex justify-between items-center px-6 py-4 hover:bg-slate-800/20 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center text-white font-medium border border-white/10">
                                  M{meeting}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-200">
                                    Team Sync Meeting {meeting}
                                  </p>
                                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                                    <ClockIcon className="h-3 w-3" />
                                    Yesterday at 2:30 PM
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
                                  Notes
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-md h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                >
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="px-6 py-3 border-t border-slate-800/50">
                          <Button
                            variant="ghost"
                            className="w-full justify-center text-slate-300 hover:text-white hover:bg-white/5 text-sm h-9"
                          >
                            View all meetings
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions Section */}
                  <Card className="bg-slate-900 border-slate-800 hover:shadow-lg hover:shadow-black/30 transition-all">
                    <CardHeader className="pb-2 pt-5 px-6 flex justify-between items-center border-b border-slate-800/50">
                      <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                        <ListTodoIcon className="h-4 w-4 text-white" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { title: "Create Meeting", icon: UsersIcon },
                          { title: "New Note", icon: FileTextIcon },
                          { title: "Schedule Event", icon: CalendarIcon },
                        ].map((action, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            className="h-20 flex-col bg-slate-800/30 border-slate-700/50 hover:border-white/20 hover:bg-slate-800/70 text-slate-300"
                          >
                            <div className="h-8 w-8 rounded-md bg-white/5 flex items-center justify-center mb-1.5">
                              <action.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium">
                              {action.title}
                            </span>
                          </Button>
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
