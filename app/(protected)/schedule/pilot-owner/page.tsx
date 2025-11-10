"use client";

import React, { useEffect, useState } from "react";
import {
  acceptSchedule,
  finalizeScheduleViaEmail,
  getSchedulesForOwner,
} from "@/actions/schedule";

import OwnerScheduleTable from "@/components/schedule/OwnerScheduleTable";

type Schedule = {
  id: string;
  pilot: string;
  requestedTime: Date;
  pilotowner: string;
  status: "PENDING" | "ACCEPTED" | "FINALIZEDVIAEMAIL";
  finalMessage?: string;
  lastUpdated: Date;
};

export default function OwnerSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getSchedulesForOwner();
        if (result?.success) {
          setSchedules(result?.data);
        }
      } catch (error) {
        console.error("Error fetching pilot owner schedules:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const refreshSchedules = async () => {
    const result = await getSchedulesForOwner();
    if (result?.success) {
      setSchedules(result?.data);
    }
    console.log("Fetched schedules:", result);
    setLoading(false);
  };

  useEffect(() => {
    refreshSchedules();
  }, []);

  const handleAcceptSchedule = async (scheduleId: string) => {
    const result = await acceptSchedule(scheduleId);
    if (result?.success) {
      await refreshSchedules();
    }
  };

  const handleFinalizeSchedule = async (
    scheduleId: string,
    message: string,
  ) => {
    const result = await finalizeScheduleViaEmail(scheduleId, message);
    if (result?.success) {
      await refreshSchedules();
    }
  };

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Pilot Owner Schedule Management
        </h1>
        <p className="text-muted-foreground">
          Manage schedule requests from pilot users
        </p>
      </div>

      <OwnerScheduleTable
        schedules={schedules}
        onAcceptSchedule={handleAcceptSchedule}
        onFinalizeSchedule={handleFinalizeSchedule}
        loading={loading}
      />
    </div>
  );
}
