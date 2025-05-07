
import { Booking, CreateBookingParams } from "@/types/booking";
import { toast } from "sonner";

// Mock database for bookings
let BOOKINGS: Booking[] = [
  {
    id: "1",
    userId: "guest",
    title: "Team Meeting",
    description: "Weekly team sync to discuss project progress",
    startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    attendees: ["user@example.com", "team@example.com"],
    createdBy: "John Smith",
    createdAt: new Date().toISOString(),
    durationMinutes: 60
  },
  {
    id: "2",
    userId: "guest",
    title: "Client Presentation",
    description: "Present new design concepts to the client",
    startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    attendees: ["client@example.com", "team@example.com"],
    createdBy: "Maria Rodriguez",
    createdAt: new Date().toISOString(),
    durationMinutes: 90
  },
];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all bookings
export const getBookings = async (): Promise<Booking[]> => {
  await delay(500);
  return [...BOOKINGS];
};

// Get user bookings
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  await delay(500);
  return BOOKINGS.filter(booking => booking.userId === userId);
};

// Create a new booking
export const createBooking = async (params: CreateBookingParams): Promise<Booking> => {
  await delay(800);

  // Check for conflicts
  const conflicts = BOOKINGS.some(booking => {
    const newStart = new Date(params.startTime);
    const newEnd = new Date(params.endTime);
    const existingStart = new Date(booking.startTime);
    const existingEnd = new Date(booking.endTime);

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });

  if (conflicts) {
    throw new Error("There is a scheduling conflict with an existing booking");
  }

  // Calculate duration if not provided
  const durationMinutes = params.durationMinutes || (() => {
    const start = new Date(params.startTime);
    const end = new Date(params.endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  })();

  const newBooking: Booking = {
    id: `${BOOKINGS.length + 1}`,
    ...params,
    attendees: params.attendees || [],
    createdAt: new Date().toISOString(),
    durationMinutes
  };

  BOOKINGS.push(newBooking);

  // Simulate sending email notifications
  if (params.attendees && params.attendees.length > 0) {
    console.log(`Email notifications sent to: ${params.attendees.join(", ")}`);
    
    // In a real app, this would be handled by a backend service
    toast.success(`Notification emails sent to attendees`);
  }

  return newBooking;
};

// Cancel a booking
export const cancelBooking = async (id: string): Promise<void> => {
  await delay(500);
  const index = BOOKINGS.findIndex(booking => booking.id === id);
  
  if (index === -1) {
    throw new Error("Booking not found");
  }
  
  // In a real app, we might not actually delete it but mark it as cancelled
  BOOKINGS = BOOKINGS.filter(booking => booking.id !== id);
};
