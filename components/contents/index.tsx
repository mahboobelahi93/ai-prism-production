"use client";

// This marks the component as a client component
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function Contents() {
  const { pilot_id } = useParams(); // Retrieve the pilot_id parameter

  useEffect(() => {
    // Use pilot_id to fetch materials or perform any other actions
  }, [pilot_id]);

  return <div>Content for Pilot ID: {pilot_id}</div>;
}
