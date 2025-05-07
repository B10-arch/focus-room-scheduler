
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addMinutes, startOfToday } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createBooking } from "@/lib/api";

// Time slots from 9AM to 5PM in 24-hour format
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor((i + 18) / 2);
  const minute = (i + 18) % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

// Duration options in minutes
const DURATION_OPTIONS = [30, 60, 90, 120, 180, 240];

const bookingSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().optional(),
  bookedBy: z.string().min(2, { message: "Please provide your name" }),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  duration: z.number({
    required_error: "Please select a duration",
  }),
  attendees: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Default to today's date
  const today = new Date();

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: "",
      description: "",
      bookedBy: "",
      attendees: "",
      date: today,
      duration: 60,
    },
  });

  const onSubmit = async (data: BookingValues) => {
    setIsLoading(true);

    // Parse time components
    const [hours, minutes] = data.startTime.split(":").map(Number);
    
    // Create date object with selected date and time
    const bookingDate = new Date(data.date);
    bookingDate.setHours(hours, minutes, 0, 0);
    
    // Calculate end time
    const endDate = addMinutes(bookingDate, data.duration);
    
    try {
      // Create booking with the user's name instead of authentication
      const booking = await createBooking({
        userId: "guest", // Use a placeholder userId for non-authenticated users
        title: data.title,
        description: data.description || "",
        startTime: bookingDate.toISOString(),
        endTime: endDate.toISOString(),
        attendees: data.attendees ? data.attendees.split(",").map(email => email.trim()) : [],
        createdBy: data.bookedBy, // Use the provided name instead of email
        durationMinutes: data.duration
      });
      
      toast.success("Booking confirmed!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Book Focus Conference Room</CardTitle>
        <CardDescription>
          Schedule your meeting in our premium conference space
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Weekly Team Standup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bookedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Meeting agenda and details..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attendees (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="email1@example.com, email2@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated email addresses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
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
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < startOfToday()} // Allow same-day booking
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time (24-hour)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select start time">
                              {field.value ? (
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {field.value}
                                </div>
                              ) : (
                                "Select start time"
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DURATION_OPTIONS.map((duration) => (
                            <SelectItem key={duration} value={duration.toString()}>
                              {duration} minutes
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Booking..." : "Book Conference Room"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
