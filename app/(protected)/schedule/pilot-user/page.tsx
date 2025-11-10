"use client";

import React, { useEffect, useState } from "react";
import { getPilotsForDropdown, getUserSchedules } from "@/actions/schedule";
import { CalendarClock, ListFilter, Plus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchedulerForm from "@/components/schedule/SchedulerForm";
import SchedulerTable from "@/components/schedule/SchedulerTable";
import { Icons } from "@/components/shared/icons";

type Schedule = {
  id: string;
  pilot: string;
  requestedTime: Date;
  pilotowner: string;
  status: "PENDING" | "ACCEPTED" | "FINALIZEDVIAEMAIL";
  finalMessage?: string;
  lastUpdated: Date;
};

export default function PilotUserSchedulePage() {
  const [options, setOptions] = useState([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch pilot options for form
        const pilotResult = await getPilotsForDropdown();
        if (pilotResult?.success) {
          setOptions(pilotResult.data);
        }

        // Fetch schedules for table
        const scheduleResult = await getUserSchedules();
        if (scheduleResult?.success) {
          setSchedules(scheduleResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto space-y-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Pilot User Schedule
        </h1>
        <p className="text-muted-foreground">
          Manage your schedule with pilot owners and view upcoming sessions
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="view">
            <ListFilter className="mr-2 h-4 w-4" />
            View Schedule
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="mr-2 h-4 w-4" />
            Create Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="mt-6">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="flex items-center text-xl font-semibold">
                <CalendarClock className="mr-2 h-5 w-5" />
                Scheduled Sessions
              </h2>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                View and manage your upcoming scheduled sessions with pilot
                owners
              </p>
              <SchedulerTable schedules={schedules} loading={loading} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Create New Schedule
              </h2>

              <div className="mb-4 rounded-md border p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    {/* <Icons.Info className="mx-auto size-4" /> */}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      Note: Only certified pilots can be scheduled. For
                      certification attempt the quiz
                    </p>
                  </div>
                </div>
              </div>

              <SchedulerForm pilotOptions={options} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
