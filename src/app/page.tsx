"use client";
import { Spotlight } from "@/components/ui/spotlight-new";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  CalendarCheck,
  FileText,
  ArrowRight,
  ChevronDown,
  Github,
} from "lucide-react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Logo from "@/components/ui/Logo";
import { useUser } from "@/components/context/auth-provider";

export default function Home() {
  const { current: currentUser } = useUser();

  return (
    <div className="w-full">
      {/* Hero section with enhanced visuals */}
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-background dark:bg-black/[0.96] antialiased bg-grid-slate-200/[0.02] dark:bg-grid-white/[0.03] relative overflow-hidden">
        <Spotlight />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-32 md:pt-40 lg:pt-32 text-center">
          <div
            className="mb-10 md:mb-12 inline-block p-2.5 px-4 rounded-full backdrop-blur-md 
                        bg-gradient-to-r from-card/90 via-background/80 to-card/90 dark:from-zinc-900/90 dark:via-black/80 dark:to-zinc-900/90 
                        border border-border/30 dark:border-zinc-700/30 
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]"
          >
            <span className="text-sm font-medium text-primary flex items-center gap-2.5">
              <span className="text-primary/90 relative">
                ✨
                <span className="absolute -inset-1 bg-primary/10 blur-sm rounded-full -z-10"></span>
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Your AI-powered productivity companion
              </span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mt-6 relative z-10">
            <div className="relative">
              <TextHoverEffect text="NotedAI" />
              <div className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-primary/0 via-primary/80 to-primary/0 blur-sm"></div>
            </div>
          </h1>

          <h2 className="text-2xl md:text-3xl font-medium text-foreground/90 dark:text-neutral-200 mt-8 mb-6">
            Your Second Brain
          </h2>

          <p className="mt-8 text-base md:text-lg text-muted-foreground dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Schedule, manage, and chat with your calendar. Get AI-generated
            summaries of meeting notes and ask questions about your content for
            enhanced productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-14 mb-24">
            {currentUser ? (
              <Button
                asChild
                size="lg"
                className="px-8 py-7 text-base font-medium rounded-xl transition-all hover:scale-105 group shadow-lg shadow-primary/10"
              >
                <Link href="/dashboard" className="flex items-center">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="px-8 py-7 text-base font-medium rounded-xl transition-all hover:scale-105 group shadow-lg shadow-primary/10"
              >
                <Link href="/signup" className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-7 text-base font-medium rounded-xl transition-all"
            >
              <Link href="#features" className="flex items-center">
                Learn More
                <ChevronDown className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Animated scroll indicator - improved positioning */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-muted-foreground dark:border-neutral-500 flex justify-center">
            <div className="w-2 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Feature highlights section with improved card styling */}
      <div
        id="features"
        className="py-32 bg-gradient-to-b from-background to-card/90 dark:from-black/[0.96] dark:to-black/[0.90]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-28">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm font-medium text-primary mb-6">
              Key Features
            </div>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-center 
                          bg-clip-text text-transparent 
                          bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60
                          dark:from-white dark:via-neutral-200 dark:to-neutral-400 
                          mb-8"
            >
              Transform Your Workflow
            </h2>
            <p className="text-lg text-muted-foreground dark:text-neutral-400 max-w-2xl text-center">
              NotedAI combines cutting-edge AI with intuitive design to help you
              manage meetings, notes, and tasks more efficiently than ever
              before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature 1 - Enhanced card with hover effects */}
            <div
              className="p-8 border border-border dark:border-neutral-800 rounded-2xl 
                          bg-gradient-to-br from-card to-background/80 
                          dark:from-black/[0.8] dark:to-neutral-900/20 
                          backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 
                          hover:border-muted-foreground/30 dark:hover:border-neutral-700/80 transition-all group"
            >
              <div className="mb-6 p-4 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                <CalendarCheck
                  className="h-8 w-8 text-primary"
                  aria-label="Calendar Management"
                />
              </div>
              <h3 className="text-2xl font-semibold text-foreground dark:text-white mb-4">
                Smart Calendar Management
              </h3>
              <p className="text-muted-foreground dark:text-neutral-300 leading-relaxed">
                Schedule, reschedule, and manage your events with AI assistance.
                Get intelligent suggestions for optimal meeting times based on
                your availability and priorities.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="p-8 border border-border dark:border-neutral-800 rounded-2xl 
                          bg-gradient-to-br from-card to-background/80 
                          dark:from-black/[0.8] dark:to-neutral-900/20 
                          backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 
                          hover:border-muted-foreground/30 dark:hover:border-neutral-700/80 transition-all group"
            >
              <div className="mb-6 p-4 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                <FileText
                  className="h-8 w-8 text-primary"
                  aria-label="AI Meeting Notes"
                />
              </div>
              <h3 className="text-2xl font-semibold text-foreground dark:text-white mb-4">
                AI-Summarized Notes
              </h3>
              <p className="text-muted-foreground dark:text-neutral-300 leading-relaxed">
                Upload or transcribe meeting notes and get instant AI-generated
                summaries with key points, action items, and follow-ups so you
                never miss important details.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="p-8 border border-border dark:border-neutral-800 rounded-2xl 
                          bg-gradient-to-br from-card to-background/80 
                          dark:from-black/[0.8] dark:to-neutral-900/20 
                          backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 
                          hover:border-muted-foreground/30 dark:hover:border-neutral-700/80 transition-all group"
            >
              <div className="mb-6 p-4 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                <MessageSquare
                  className="h-8 w-8 text-primary"
                  aria-label="Conversational AI"
                />
              </div>
              <h3 className="text-2xl font-semibold text-foreground dark:text-white mb-4">
                Conversational Knowledge
              </h3>
              <p className="text-muted-foreground dark:text-neutral-300 leading-relaxed">
                Ask questions about your meetings, notes, and tasks in natural
                language. NotedAI answers using your content, creating a
                personalized knowledge base.
              </p>
            </div>
          </div>

          <div className="text-center mt-28 relative">
            <div className="absolute inset-0 -z-10 blur-[100px] bg-primary/10 rounded-full opacity-70"></div>
            <Button
              asChild
              size="lg"
              className="px-10 py-7 text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              <Link
                href={currentUser ? "/dashboard" : "/signup"}
                className="flex items-center"
              >
                {currentUser ? "Go to Dashboard" : "Get Started for Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

{/* New Footer Section */}
<footer className="bg-muted/30 dark:bg-black border-t border-border dark:border-neutral-800">
  <div className="max-w-7xl mx-auto px-6 py-20">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-6 lg:gap-x-12 mb-16">
      {/* Company Info */}
      <div className="md:col-span-6 lg:col-span-5">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-md">
            <Logo />
          </div>
          <span className="font-bold text-xl text-foreground dark:text-white">
            NotedAI
          </span>
        </div>
        <p className="text-muted-foreground dark:text-neutral-400 max-w-md mb-8 leading-relaxed">
          NotedAI combines state-of-the-art AI with intuitive design to
          help professionals manage their meetings and notes more
          efficiently.
        </p>
        <div className="flex space-x-5">
          <a
            href="https://github.com/Vinayak2k03/NotedAI"
            className="text-muted-foreground hover:text-primary transition-colors dark:text-neutral-400 dark:hover:text-primary"
          >
            <Github size={20} />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>

      {/* Quick Links - Now positioned with specific columns */}
      <div className="md:col-span-4 lg:col-span-3 md:col-start-8 lg:col-start-9">
        <h3 className="font-semibold text-foreground dark:text-white mb-5 text-lg">
          Quick Links
        </h3>
        <ul className="space-y-3">
          <li>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-primary transition-colors dark:text-neutral-400 dark:hover:text-primary"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/meeting"
              className="text-muted-foreground hover:text-primary transition-colors dark:text-neutral-400 dark:hover:text-primary"
            >
              Meetings
            </Link>
          </li>
          <li>
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-colors dark:text-neutral-400 dark:hover:text-primary"
            >
              Features
            </Link>
          </li>
        </ul>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t border-border dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-center items-center">
      <p className="text-muted-foreground/70 dark:text-neutral-500 text-sm">
        © {new Date().getFullYear()} NotedAI. All rights reserved.
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}
