
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
}

export interface CreateBookingParams {
  userId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
  createdBy: string;
}
