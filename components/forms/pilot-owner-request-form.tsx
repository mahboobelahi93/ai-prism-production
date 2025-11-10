"use client";

import * as React from "react";
import { checkUserExists, submitPilotOwnerRequest } from "@/actions/check-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/shared/icons";

// Pilot Owner Request Schema
const pilotOwnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  organization: z.string().min(2, "Organization must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(6, "Please enter a valid phone number")
    .max(15, "Phone number is too long"),
  purpose: z
    .string()
    .min(10, "Please provide a brief purpose (minimum 10 characters)")
    .max(200, "Purpose cannot exceed 200 characters"),
});

type PilotOwnerFormData = z.infer<typeof pilotOwnerSchema>;

interface PilotOwnerRequestFormProps {
  disabled?: boolean;
}

export function PilotOwnerRequestForm({
  disabled = false,
}: PilotOwnerRequestFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [isCheckingEmail, setIsCheckingEmail] = React.useState<boolean>(false);
  const [emailStatus, setEmailStatus] = React.useState<
    "available" | "taken" | null
  >(null);

  const form = useForm<PilotOwnerFormData>({
    resolver: zodResolver(pilotOwnerSchema),
    defaultValues: {
      name: "",
      organization: "",
      email: "",
      phoneNumber: "",
      purpose: "",
    },
  });

  // Watch email field for real-time validation
  const watchedEmail = form.watch("email");
  const purposeValue = form.watch("purpose") || "";
  const maxChars = 200;

  // Debounced email checking
  React.useEffect(() => {
    if (!watchedEmail || !watchedEmail.includes("@")) {
      setEmailStatus(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      await checkEmailAvailability(watchedEmail);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [watchedEmail]);

  async function checkEmailAvailability(email: string) {
    if (!email || !email.includes("@")) return;

    setIsCheckingEmail(true);
    form.clearErrors("email");

    try {
      const userCheck = await checkUserExists(email.toLowerCase());

      if (!userCheck.success) {
        console.error("Error checking email:", userCheck.error);
        setEmailStatus(null);
        return;
      }

      if (!userCheck.exists) {
        setEmailStatus("not-registered");
        form.setError("email", {
          type: "manual",
          message:
            "Please sign up for an account first before requesting pilot owner access",
        });
      } else if (userCheck.user.role === "PILOTOWNER") {
        setEmailStatus("already-pilot-owner");
        form.setError("email", {
          type: "manual",
          message: "You are already a pilot owner",
        });
      } else {
        setEmailStatus("ok");
        form.clearErrors("email");
      }
    } catch (error) {
      console.error("Email check error:", error);
      setEmailStatus(null);
    } finally {
      setIsCheckingEmail(false);
    }
  }

  async function onSubmit(data: PilotOwnerFormData) {
    setIsLoading(true);

    try {
      const userCheck = await checkUserExists(data.email.toLowerCase());

      if (!userCheck.success) {
        setIsLoading(false);
        return toast.error("Verification failed", {
          description:
            userCheck.error || "Failed to verify email. Please try again.",
        });
      }

      if (!userCheck.exists) {
        setIsLoading(false);
        setEmailStatus("taken");
        form.setError("email", {
          type: "manual",
          message:
            "Please sign up for an account first before requesting pilot owner access",
        });
        return;
      }

      const submissionData = {
        ...data,
        contactNumber: data.phoneNumber,
      };

      const result = await submitPilotOwnerRequest(submissionData);

      if (!result.success) {
        toast.error("Request failed", {
          description:
            result.error || "Something went wrong. Please try again.",
        });
        return;
      }

      toast.success("Request submitted successfully!", {
        description:
          "Your pilot owner request has been sent to the admin for review.",
      });

      form.reset();
      setDialogOpen(false);
      setEmailStatus(null);
    } catch (error) {
      toast.error("Network error", {
        description:
          "Failed to submit request. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "secondary" }))}
          disabled={disabled}
        >
          <Icons.user className="mr-2 size-4" />
          Request Pilot Owner Access
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Pilot Owner Access</DialogTitle>
          <DialogDescription>
            Please sign up for an account first before requesting pilot owner
            access
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Field */}
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your organization"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field with Real-time Validation */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        disabled={isLoading}
                        className={cn(
                          emailStatus === "taken" && "border-red-500",
                          emailStatus === "available" && "border-green-500",
                        )}
                        {...field}
                      />
                      {isCheckingEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Icons.spinner className="size-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      {!isCheckingEmail && emailStatus === "available" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Icons.check className="size-4 text-green-500" />
                        </div>
                      )}
                      {!isCheckingEmail && emailStatus === "taken" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Icons.x className="size-4 text-red-500" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                  {!form.formState.errors.email &&
                    emailStatus === "available" && (
                      <p className="text-xs text-green-600">
                        ✓ Email is available
                      </p>
                    )}
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(Country code) Phone number"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purpose Field with Character Counter */}
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Brief description of why you need pilot owner access..."
                        rows={3}
                        disabled={isLoading}
                        className="resize-none"
                        maxLength={maxChars}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                onClick={() => setDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={cn(buttonVariants(), "flex-1")}
                disabled={isLoading || emailStatus === "taken"}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                Submit Request
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
