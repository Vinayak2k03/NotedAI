import { Spotlight } from "@/components/ui/spotlight-new";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, CalendarCheck, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="w-[100vw]">
      <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Meet <span className="text-primary">NotedAI</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-center text-neutral-200 mt-4">
            Your Second Brain
          </h2>
          <p className="mt-6 font-normal text-base md:text-lg text-neutral-300 max-w-2xl text-center mx-auto leading-relaxed">
            Schedule, manage, and chat with your calendar. Get AI-generated
            summaries of meeting notes and ask questions about your content for
            enhanced productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button asChild size="lg" className="px-8 py-6 text-base">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base bg-transparent border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-100"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Feature highlights section */}
      <div id="features" className="py-24 bg-black/[0.90]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 to-neutral-400 mb-16">
            Features That Transform Your Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-neutral-800 rounded-xl bg-black/[0.6] backdrop-blur-sm">
              <div className="mb-5 p-3 rounded-full bg-primary/10 w-fit">
                <CalendarCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Smart Calendar Management
              </h3>
              <p className="text-neutral-300">
                Schedule, reschedule, and manage your events with AI assistance.
                Get smart suggestions for optimal meeting times.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-neutral-800 rounded-xl bg-black/[0.6] backdrop-blur-sm">
              <div className="mb-5 p-3 rounded-full bg-primary/10 w-fit">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                AI-Summarized Meeting Notes
              </h3>
              <p className="text-neutral-300">
                Upload or transcribe meeting notes and get instant AI-generated
                summaries with key points, action items, and follow-ups.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-neutral-800 rounded-xl bg-black/[0.6] backdrop-blur-sm">
              <div className="mb-5 p-3 rounded-full bg-primary/10 w-fit">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Conversational Knowledge Base
              </h3>
              <p className="text-neutral-300">
                Ask questions about your meetings, notes, and tasks. NotedAI
                answers using your content, so you never miss important details.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button asChild size="lg" className="px-8 py-6 text-base">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
