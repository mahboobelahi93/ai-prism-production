"use server";

import { getPilotDetailsById } from "@/actions/pilots";
import { checkQuizAttempt } from "@/actions/quizz-attempts";
import { fetchQuizzesByPilotId } from "@/actions/quizzes";
import { IBreadcrumbItem } from "@/types";

import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { CustomBreadcrumb } from "@/components/shared/custom-breadcrumb";

import ContentDetails from "../../_components/content-details";

const courseContent = [
  {
    id: "1",
    title: "Module 1: Introduction",
    lessons: [
      {
        id: "1.1",
        title: "Welcome to the Course",
        duration: "5:00",
        completed: true,
      },
      {
        id: "1.2",
        title: "Course Overview",
        duration: "10:00",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    title: "Module 2: Fundamentals",
    lessons: [
      {
        id: "2.1",
        title: "Basic Concepts",
        duration: "15:00",
        completed: false,
      },
      {
        id: "2.2",
        title: "Advanced Techniques",
        duration: "20:00",
        completed: false,
      },
    ],
  },
];

const attachments = [
  { id: "1", title: "Lesson Slides", type: "pdf" },
  { id: "2", title: "Exercise Worksheet", type: "docx" },
  { id: "3", title: "Additional Resources", type: "zip" },
];

export default async function LearningPage({
  params,
}: {
  params: { pilot_id: string };
}) {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pilots", href: "/portal/pilots" },
    {
      label: "Details",
      href: `/portal/pilots/details/${params.pilot_id}`,
    },
    { label: "Contents" },
  ];
  const user = await getCurrentUser();
  const quizzes = await fetchQuizzesByPilotId(params.pilot_id);
  const examQuiz = quizzes.data?.findLast((item) => item.setAsExam);
  const quizAttempt = await checkQuizAttempt({
    userId: user?.id,
    quizInfoId: examQuiz?.id,
  });
  const pilotDetails = await getPilotDetailsById(params.pilot_id);

  if (!pilotDetails.success) {
    throw new Error("Failed to fetch pilot details");
  }

  return (
    <>
      {/* <CustomBreadcrumb items={breadcrumbItems} /> */}
      <DashboardHeader heading="Contents" text="Pilot contents are displayed" />
      <ContentDetails
        courseContent={pilotDetails}
        quizzes={examQuiz}
        quizAttempt={quizAttempt}
      />
    </>
  );
}
