
export interface Booking {
  id: string;
  userId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  createdBy: string;
  createdAt: string;
  durationMinutes?: number; // Added for tracking duration
}

export interface CreateBookingParams {
  userId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
  createdBy: string;
  durationMinutes?: number; // Added for tracking duration
}
