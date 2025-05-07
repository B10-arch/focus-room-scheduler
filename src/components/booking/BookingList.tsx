
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  onCancelBooking: (id: string) => void;
}

export function BookingCard({ booking, onCancelBooking }: BookingCardProps) {
  const { currentUser } = useAuth();
  const isOwner = currentUser?.id === booking.userId;
  const isAdmin = currentUser?.isAdmin;
  
  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes} minutes`;
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  };
  
  const handleCancel = () => {
    onCancelBooking(booking.id);
    toast.success("Booking cancelled successfully");
  };
  
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const isPast = endTime < new Date();
  
  return (
    <Card className={cn(
      "w-full transition-all hover:shadow-md",
      isPast ? "opacity-60" : ""
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.title}</CardTitle>
            <CardDescription className="mt-1">
              Booked by {booking.createdBy}
            </CardDescription>
          </div>
          {isPast ? (
            <Badge variant="outline" className="bg-muted">Past</Badge>
          ) : (
            <Badge className="bg-primary">Upcoming</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{format(startTime, "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
              <span className="text-muted-foreground ml-2">
                ({formatDuration(booking.startTime, booking.endTime)})
              </span>
            </span>
          </div>
          {booking.description && (
            <div className="mt-2 text-sm text-muted-foreground">
              {booking.description}
            </div>
          )}
          {booking.attendees && booking.attendees.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium">Attendees: </span>
              {booking.attendees.join(", ")}
            </div>
          )}
        </div>
      </CardContent>
      {!isPast && (isOwner || isAdmin) && (
        <CardFooter className="pt-2">
          <Button 
            variant="destructive" 
            size="sm" 
            className="ml-auto"
            onClick={handleCancel}
          >
            Cancel Booking
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function BookingList({ bookings, onCancelBooking }: { 
  bookings: Booking[],
  onCancelBooking: (id: string) => void
}) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bookings.map((booking) => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          onCancelBooking={onCancelBooking}
        />
      ))}
    </div>
  );
}
