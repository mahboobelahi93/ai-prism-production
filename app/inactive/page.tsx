import { SignOutButton } from "@clerk/nextjs"
import { AlertCircle, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function InactivePage({
    searchParams,
}: {
    searchParams: { message?: string }
}) {
    const message = searchParams?.message || "Your account is inactive. Please contact support."

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="size-6 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Account Inactive</CardTitle>
                    <CardDescription className="text-base">Your account access has been temporarily suspended</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertCircle className="size-4" />
                        <AlertTitle>Access Restricted</AlertTitle>
                        <AlertDescription className="text-pretty">{message}</AlertDescription>
                    </Alert>
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <div className="flex items-start gap-3">
                            <Mail className="mt-0.5 size-5 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Need help?</p>
                                <p className="text-sm text-muted-foreground">
                                    Contact our support team at{" "}
                                    <a
                                        href="mailto:support@example.com"
                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        support@example.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <SignOutButton>
                        <Button variant="outline" className="w-full bg-transparent">
                            Go to Login
                        </Button>
                    </SignOutButton>
                </CardFooter>
            </Card>
        </div>
    )
}
