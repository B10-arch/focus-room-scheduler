
import { Booking, CreateBookingParams } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get all bookings
export const getBookings = async (): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }

    return data.map(booking => ({
      id: booking.id,
      userId: 'guest',
      title: booking.title,
      description: booking.description || '',
      startTime: booking.start_time,
      endTime: booking.end_time,
      attendees: booking.attendees || [],
      createdBy: booking.booked_by,
      createdAt: booking.created_at,
      durationMinutes: calculateDuration(booking.start_time, booking.end_time)
    }));
  } catch (error) {
    console.error('Error in getBookings:', error);
    toast.error("Failed to load bookings");
    return [];
  }
};

// Get user bookings - in this case, all bookings (since we're not using auth)
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  // Without authentication, we're just returning all bookings
  return getBookings();
};

// Calculate duration in minutes between two timestamps
const calculateDuration = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
};

// Create a new booking
export const createBooking = async (params: CreateBookingParams): Promise<Booking> => {
  try {
    // Check for conflicts first - fixed conflict check logic
    const conflictsCheck = await checkBookingConflicts(params.startTime, params.endTime);
    
    if (conflictsCheck.conflicts) {
      throw new Error("There is a scheduling conflict with an existing booking");
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        title: params.title,
        description: params.description,
        booked_by: params.createdBy,
        start_time: params.startTime,
        end_time: params.endTime,
        attendees: params.attendees || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }

    // Convert to our app's Booking type
    const newBooking: Booking = {
      id: data.id,
      userId: 'guest',
      title: data.title,
      description: data.description || '',
      startTime: data.start_time,
      endTime: data.end_time,
      attendees: data.attendees || [],
      createdBy: data.booked_by,
      createdAt: data.created_at,
      durationMinutes: params.durationMinutes || calculateDuration(data.start_time, data.end_time)
    };

    // Simulate sending email notifications
    if (params.attendees && params.attendees.length > 0) {
      console.log(`Email notifications would be sent to: ${params.attendees.join(", ")}`);
      toast.success(`Notification emails sent to attendees`);
    }

    return newBooking;
  } catch (error) {
    console.error('Error in createBooking:', error);
    toast.error(error instanceof Error ? error.message : "Failed to create booking");
    throw error;
  }
};

// Fixed booking conflict check logic
const checkBookingConflicts = async (
  startTime: string,
  endTime: string
): Promise<{ conflicts: boolean }> => {
  try {
    // Get all existing bookings
    const { data, error } = await supabase
      .from('bookings')
      .select('start_time, end_time');

    if (error) {
      console.error('Error checking conflicts:', error);
      throw error;
    }

    // Parse the new booking times
    const newStart = new Date(startTime).getTime();
    const newEnd = new Date(endTime).getTime();
    
    // Check for any overlapping bookings
    const conflicts = data.some(booking => {
      const existingStart = new Date(booking.start_time).getTime();
      const existingEnd = new Date(booking.end_time).getTime();
      
      // Check if bookings overlap
      return (
        (newStart >= existingStart && newStart < existingEnd) || // New booking starts during existing booking
        (newEnd > existingStart && newEnd <= existingEnd) || // New booking ends during existing booking
        (newStart <= existingStart && newEnd >= existingEnd) // New booking completely encompasses existing booking
      );
    });

    return { conflicts };
  } catch (error) {
    console.error('Error in checkBookingConflicts:', error);
    // Default to no conflicts on error to prevent false positives
    return { conflicts: false };
  }
};

// Cancel a booking
export const cancelBooking = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    toast.error("Failed to cancel booking");
    throw error;
  }
};
