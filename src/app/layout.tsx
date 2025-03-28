import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import Navigation from "@/components/landing/navigation";
import { ThemeProvider } from "@/components/context/theme-provider";
import { AuthProvider } from "@/components/context/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NotedAI",
  description: "AI-powered note-taking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <CopilotKit runtimeUrl="/api/copilotkit">
                <Navigation />
                {children}
                <CopilotPopup
                  labels={{
                    title: "NotedAI",
                    initial:
                      "Hello! I'm your NotedAI assistant. How can I help you today?",
                  }}
                  className="copilot-popup-container"
                />
              </CopilotKit>
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
