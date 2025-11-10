"use client"
import { EmptyPlaceholder } from '@/components/shared/empty-placeholder'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function EmptyCard() {
    const router = useRouter();
    return (
        <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="package" />
            <EmptyPlaceholder.Title>No pilots listed</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
                You don&apos;t have any pilots yet. Start creating new pilots.
            </EmptyPlaceholder.Description>
            <Button onClick={() => router.push("/portal/pilots/new")}>Add Pilot</Button>
        </EmptyPlaceholder>
    )
}
