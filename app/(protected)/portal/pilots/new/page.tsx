import { DashboardHeader } from '@/components/dashboard/header'
import AddPilotForm from '@/components/forms/add-pilot-form'
import { CustomBreadcrumb } from '@/components/shared/custom-breadcrumb'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IBreadcrumbItem } from '@/types'
import { Tabs, TabsContent } from '@radix-ui/react-tabs'
import Link from 'next/link'
import React from 'react'

export default function New() {
    const breadcrumbItems: IBreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Pilots', href: '/portal/pilots' },
        { label: 'New' }, // The last item doesn't need an href
    ];
    return (
        <>
            <CustomBreadcrumb items={breadcrumbItems} />
            <DashboardHeader
                heading="Add New Pilot"
                text=""
            />
            <div className="container mx-auto p-0">
                <div className="flex w-full flex-wrap gap-4">
                    <Tabs defaultValue="details" className="w-full space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="details">Pilot Details</TabsTrigger>
                            <TabsTrigger value="lessons" disabled>Lessons</TabsTrigger>
                            <TabsTrigger value="quizzes" disabled>Quizzes</TabsTrigger>
                            <TabsTrigger value="preview" disabled>Preview & Finalize</TabsTrigger>
                        </TabsList>
                        <TabsContent value='details'>
                            <AddPilotForm />
                        </TabsContent>
                        <TabsContent value='lessons'>
                            <h1>Add New Lessons</h1>
                        </TabsContent>
                        <TabsContent value='quizzes'>
                            <h1>Add New Quizzes</h1>
                        </TabsContent>
                        <TabsContent value='preview'>
                            <h1>Preview</h1>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
