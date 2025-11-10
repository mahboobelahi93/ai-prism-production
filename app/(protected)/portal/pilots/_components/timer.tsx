'use client'

import { formatTime } from '@/lib/utils'
import { useEffect } from 'react'

interface TimerProps {
    timeRemaining: number
    onTimeEnd: () => void
    onTick: (newTime: number) => void
}

export function Timer({ timeRemaining, onTimeEnd, onTick }: TimerProps) {
    useEffect(() => {
        if (timeRemaining <= 0) {
            onTimeEnd()
            return
        }

        const interval = setInterval(() => {
            onTick(timeRemaining - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [timeRemaining, onTimeEnd, onTick])

    return (
        <div className="font-mono text-lg">
            Time Remaining: {formatTime(timeRemaining)}
        </div>
    )
}

