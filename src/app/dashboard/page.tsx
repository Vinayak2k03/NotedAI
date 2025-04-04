"use client";
import Calendar from "@/components/calendar/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  FileTextIcon,
  UsersIcon,
  Settings2Icon,
  LayoutDashboardIcon,
  BellIcon,
  SearchIcon,
  PlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Custom sidebar navigation item component
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
          {/* Sidebar */}
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

            {/* Navigation */}
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

          {/* Main content area */}
          <div className="md:ml-64 w-full">
            {/* Top navigation bar */}
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
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-2 border-slate-700/50 hover:border-slate-600 text-white bg-transparent hover:bg-slate-800/60 h-8"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>New Meeting</span>
                </Button>
              </div>
            </div>

            {/* Main calendar section */}
            <div className="p-6 pt-24">
              <div className="max-w-7xl mx-auto">
                {/* Calendar Card */}
                <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800/50 shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden">
                  <CardHeader className="pb-2 pt-5 px-6 flex justify-between items-center border-b border-slate-800/50">
                    <CardTitle className="text-xl font-medium text-white flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-white" />
                      Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    {/* Calendar with increased height for better visibility */}
                    <div className="h-[600px]">
                      <Calendar />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}