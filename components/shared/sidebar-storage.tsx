import { Progress } from "@/components/ui/progress"
import { HardDrive, AlertTriangle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatBytes } from "@/lib/utils"

interface StorageUsageProps {
    used: number
    total: number
    warningThreshold?: number
    criticalThreshold?: number
}

export function StorageUsage({ used, total, warningThreshold = 75, criticalThreshold = 90 }: Readonly<StorageUsageProps>) {
    const usedGB = formatBytes(used);
    const totalGB = formatBytes(total);
    const percentage = Math.min(Math.round((used / total) * 100), 100)

    const isWarning = percentage >= warningThreshold && percentage < criticalThreshold
    const isCritical = percentage >= criticalThreshold

    const getProgressColor = () => {
        if (isCritical) return "bg-red-600"
        if (isWarning) return "bg-amber-500"
        return "bg-primary"
    }

    return (
        <div className="mt-2 border-t border-gray-200 px-4 py-3">
            <div className="mb-2 flex items-center">
                <HardDrive className="mr-2 size-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Storage</span>
            </div>

            <Progress value={percentage} className="mb-1 h-2" indicatorClassName={getProgressColor()} />

            <div className="mt-1 flex justify-between">
                <span className="text-xs text-gray-500">{usedGB} used</span>
                <span className="text-xs text-gray-500">
                    {percentage}% of {totalGB}
                </span>
            </div>

            {isWarning && (
                <Alert className="mt-2 border-amber-200 bg-amber-50 py-2">
                    <AlertTriangle className="size-4 text-amber-500" />
                    <AlertDescription className="ml-2 text-xs text-amber-700">
                        Your storage is getting full. Consider upgrading or removing unused files.
                    </AlertDescription>
                </Alert>
            )}

            {isCritical && (
                <Alert className="mt-2 border-red-200 bg-red-50 py-2">
                    <AlertCircle className="size-4 text-red-500" />
                    <AlertDescription className="ml-2 text-xs text-red-700">
                        Critical storage limit reached! You won&apos;t be able to upload new files until you free up space.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
