"use client"

import { ThemeMode } from "../theme-mode-util";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useUser } from "../context/auth-provider";
import { useState, useEffect } from "react";
import { Icons } from "../ui/icons";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    setLoading(true);
    await user.logout();
    setLoading(false);
    setIsMenuOpen(false);
  };

  // Determine which links to show based on current path
  const isDashboardPath = pathname === "/dashboard";
  const showDashboardLinks = !isDashboardPath && user.current;
  const showMeetingTasksLinks = isDashboardPath && user.current;

  return (
    <>
      {/* Fullscreen backdrop overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-neutral-200/20 dark:border-neutral-800/30">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <Link 
            href="/" 
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-md">
              <Logo/>
            </div>
            <span className="font-semibold text-xl tracking-tight">NotedAI</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden relative z-50 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user.current ? (
              <>
                <Link
                  href="/dashboard"
                  className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all"
                >
                  Dashboard
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-destructive after:transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <Icons.spinner className="size-4 animate-spin" />
                  ) : (
                    "Sign Out"
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/signin"
                  className="text-sm font-medium px-4 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
            <div className="border-l border-neutral-200/20 dark:border-neutral-800/30 h-8 mx-1"></div>
            <ThemeMode />
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="fixed inset-x-0 top-16 z-45 md:hidden">
              <div className="bg-background/95 border-b border-neutral-200/20 dark:border-neutral-800/30 shadow-lg rounded-b-lg mx-4 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-300">
                <div className="flex flex-col p-6 gap-4">
                  {user.current ? (
                    <>
                      {/* Show different links based on current path */}
                      {showDashboardLinks && (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-md hover:bg-accent/50 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icons.dashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      
                      {showMeetingTasksLinks && (
                        <>
                          <Link
                            href="/meeting"
                            className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-md hover:bg-accent/50 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icons.users className="h-5 w-5" />
                            <span>Meetings</span>
                          </Link>
                          <Link
                            href="/tasks"
                            className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-md hover:bg-accent/50 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icons.fileText className="h-5 w-5" />
                            <span>Tasks</span>
                          </Link>
                        </>
                      )}
                      
                      <div className="border-t border-neutral-200/10 dark:border-neutral-800/20 my-2"></div>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <Icons.spinner className="size-5 animate-spin" />
                            <span>Signing out...</span>
                          </div>
                        ) : (
                          <>
                            <Icons.logout className="h-5 w-5" />
                            <span>Sign Out</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-md hover:bg-accent/50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icons.login className="h-5 w-5" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/signup"
                        className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icons.user className="h-5 w-5" />
                        <span>Get Started</span>
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-neutral-200/10 dark:border-neutral-800/20 pt-4 mt-2 flex justify-center">
                    <ThemeMode />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}