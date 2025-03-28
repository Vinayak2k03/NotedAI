import Calendar from "@/components/calendar/Calendar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="mx-auto space-y-6">
        <div className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <AppSidebar />
          </div>

          <Card className="col-span-1 md:col-span-3 w-full dark:border-none">
            <CardContent className="flex flex-col items-center py-4 justify-center w-full">
              <div className="w-full">
                <Calendar />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
