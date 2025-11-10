"use server"
import { getPilotDetailsById } from '@/actions/pilots'
import NotFound from '@/app/not-found'
import { DashboardHeader } from '@/components/dashboard/header'
import AddLessonForm from '@/components/forms/add-lesson-form'
import AddPilotForm from '@/components/forms/add-pilot-form'
import { CustomBreadcrumb } from '@/components/shared/custom-breadcrumb'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IBreadcrumbItem } from '@/types'
import { Tabs, TabsContent } from '@radix-ui/react-tabs'
import React from 'react'
import PilotDetails from '../../details/_components/pilot-details'
import { QuizList } from '../../_components/quiz-list'
import { fetchQuizzesByPilotId } from '@/actions/quizzes'

export default async function Edit({ params, searchParams }: {
    params: { pilot_id: string }, searchParams?: Promise<{
        tab?: string;
    }>;
}) {
    const tabParams = await searchParams;
    let tab = tabParams?.tab;
    if (!tab) {
        tab = 'details'
    }
    const breadcrumbItems: IBreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Pilots', href: '/portal/pilots' },
        { label: 'Edit' }, // The last item doesn't need an href
    ];

    const pilotDetails = await getPilotDetailsById(params.pilot_id);

    const quizzes = await fetchQuizzesByPilotId(params.pilot_id)


    if (!pilotDetails?.success) {
        return (
            <>
                <CustomBreadcrumb items={breadcrumbItems} />
                <DashboardHeader
                    heading="Edit Pilot"
                    text=""
                />
                <NotFound buttonTxt='Go Back' message={pilotDetails?.message} url='/portal/pilots/new' />
            </>
        )
    }

    return (
        <>
            <CustomBreadcrumb items={breadcrumbItems} />
            <DashboardHeader
                heading={"Edit \'" + pilotDetails.data?.title + "'"}
                text=""
            />
            <div className="container mx-auto p-0">
                <div className="flex w-full flex-wrap gap-4">
                    <Tabs defaultValue={tab ? tab : "details"} className="w-full space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="details">Pilot Details</TabsTrigger>
                            <TabsTrigger value="lessons">Lessons</TabsTrigger>
                            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                            <TabsTrigger value="preview">Preview & Finalize</TabsTrigger>
                        </TabsList>
                        <TabsContent value='details'>
                            <AddPilotForm pilotDetails={pilotDetails?.data} />
                        </TabsContent>
                        <TabsContent value='lessons'>
                            <AddLessonForm existingLessons={pilotDetails?.data?.lessons ?? null} pilotId={params.pilot_id} />
                        </TabsContent>
                        <TabsContent value='quizzes'>
                            <QuizList quizzes={quizzes.data} pilotId={params.pilot_id} />
                        </TabsContent>
                        <TabsContent value='preview'>
                            <PilotDetails pilotDetails={pilotDetails?.data} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
