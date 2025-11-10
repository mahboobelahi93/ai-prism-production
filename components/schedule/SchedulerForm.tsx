"use client";

import { useTransition } from "react";
import { createSchedule } from "@/actions/schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export default function SchedulerForm({
  pilotOptions = [],
  onSubmitSuccess,
}: {
  pilotOptions?: Array<{
    value: string;
    label: string;
    owner: string;
    email: string;
  }>;
  onSubmitSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const formSchema = z.object({
    selectedPilot: z.string({
      required_error: "Please select a pilot",
    }),
    pilotTitle: z.string().min(1, "Pilot title is required"),
    date: z.date({
      required_error: "Please select a date",
    }),
    time: z.string({
      required_error: "Please select a time",
    }),
    message: z
      .string()
      .max(100, "Message cannot exceed 100 characters")
      .optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedPilot: "",
      pilotTitle: "",
      date: new Date(),
      time: format(new Date(), "HH:mm"),
      message: "",
    },
  });

  // Watch for selectedPilot changes to update pilotTitle
  const selectedPilotId = form.watch("selectedPilot");

  // Update pilotTitle when selectedPilot changes
  const handlePilotChange = (value: string) => {
    form.setValue("selectedPilot", value);
    const selectedPilot = pilotOptions.find((pilot) => pilot.value === value);
    if (selectedPilot) {
      form.setValue("pilotTitle", `${selectedPilot?.email} `);
    } else {
      form.setValue("pilotTitle", "");
    }
  };

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      try {
        // Combine date and time
        const [hours, minutes] = data.time.split(":");
        const scheduledDateTime = new Date(data.date);
        scheduledDateTime.setHours(Number(hours), Number(minutes));

        const result = await createSchedule({
          pilotId: data.selectedPilot,
          scheduledDateTime: scheduledDateTime.toISOString(), // Convert to ISO string for the server
          message: data.message || undefined,
        });

        if (result.success) {
          toast({
            title: "Success",
            description:
              result.message || "Your schedule has been created successfully.",
          });

          // Reset form
          form.reset({
            selectedPilot: "",
            pilotTitle: "",
            date: undefined,
            time: "",
            message: "",
          });

          // Call success callback if provided
          if (onSubmitSuccess) {
            onSubmitSuccess();
          }
        } else {
          // Handle specific error cases from the server
          toast({
            title: "Unable to Schedule",
            description:
              result.message ||
              "An error occurred while creating the schedule.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Schedule creation error:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An error occurred while creating the schedule.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Schedule a Pilot Session</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Dropdown box for pilots */}
            <FormField
              control={form.control}
              name="selectedPilot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Pilot</FormLabel>
                  <Select
                    onValueChange={handlePilotChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pilot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pilotOptions.map((pilot) => (
                        <SelectItem key={pilot.value} value={pilot.value}>
                          {pilot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Textbox prefilled with pilot title and owner */}
            <FormField
              control={form.control}
              name="pilotTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilot Owner Email</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time picker */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time (GMT+2)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Optional message textarea with 100 char limit */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional - 100 char max)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      maxLength={100}
                      placeholder="Enter any additional information or requests for this session"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Scheduling..." : "Schedule"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
