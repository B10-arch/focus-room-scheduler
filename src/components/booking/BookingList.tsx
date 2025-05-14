import { format } from "date-fns";
import { CalendarIcon, Clock, ChevronRight, ChevronDown } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { BookingTimer } from "./BookingTimer";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BookingCardProps {
  booking: Booking;
  onCancelBooking: (id: string) => void;
}

export function BookingCard({ booking, onCancelBooking }: BookingCardProps) {
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
  const isActive = startTime <= new Date() && endTime > new Date();
  
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
          ) : isActive ? (
            <Badge className="bg-green-500 text-white">In Progress</Badge>
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
              {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
              <span className="text-muted-foreground ml-2">
                ({formatDuration(booking.startTime, booking.endTime)})
              </span>
            </span>
          </div>
          
          {!isPast && (
            <div className="mt-2">
              <BookingTimer startTime={booking.startTime} endTime={booking.endTime} />
            </div>
          )}
          
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
      {!isPast && (
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

interface UserBookingsRowProps {
  userName: string;
  bookings: Booking[];
}

function UserBookingsRow({ userName, bookings }: UserBookingsRowProps) {
  const [expanded, setExpanded] = useState(false);
  const totalBookings = bookings.length;
  
  // Calculate total hours booked by this user
  const totalMinutes = bookings.reduce((total, booking) => {
    const startDate = new Date(booking.startTime);
    const endDate = new Date(booking.endTime);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    return total + durationMinutes;
  }, 0);
  
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  // Get the most recent booking date
  const mostRecentBooking = new Date(Math.max(
    ...bookings.map(booking => new Date(booking.endTime).getTime())
  ));
  
  return (
    <>
      <TableRow 
        className="cursor-pointer hover:bg-muted/80" 
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="font-medium flex items-center">
          {expanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
          {userName}
        </TableCell>
        <TableCell>{totalBookings}</TableCell>
        <TableCell>
          {totalHours} hr {remainingMinutes > 0 ? `${remainingMinutes} min` : ""}
        </TableCell>
        <TableCell>{format(mostRecentBooking, "MMM d, yyyy")}</TableCell>
      </TableRow>
      
      {expanded && (
        <TableRow>
          <TableCell colSpan={4} className="p-0">
            <div className="p-4 bg-muted/20 border-t border-b">
              <h4 className="font-medium text-sm mb-3">Booking History</h4>
              <div className="grid gap-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="text-sm p-3 bg-background rounded-md border">
                    <div className="font-medium">{booking.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(new Date(booking.startTime), "MMM d, yyyy")} | 
                      <Clock className="h-3 w-3 mx-1" />
                      {format(new Date(booking.startTime), "HH:mm")} - {format(new Date(booking.endTime), "HH:mm")}
                    </div>
                    {booking.description && (
                      <div className="text-xs mt-2 text-muted-foreground">{booking.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function PastBookingsByUser({ bookings }: { bookings: Booking[] }) {
  // Group bookings by user
  const bookingsByUser: Record<string, Booking[]> = {};
  
  bookings.forEach(booking => {
    if (!bookingsByUser[booking.createdBy]) {
      bookingsByUser[booking.createdBy] = [];
    }
    bookingsByUser[booking.createdBy].push(booking);
  });
  
  const users = Object.keys(bookingsByUser);
  
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No past bookings found</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Total Bookings</TableHead>
          <TableHead>Total Time</TableHead>
          <TableHead>Last Booking</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <UserBookingsRow 
            key={user} 
            userName={user} 
            bookings={bookingsByUser[user]} 
          />
        ))}
      </TableBody>
    </Table>
  );
}

export function BookingList({ 
  bookings, 
  onCancelBooking,
  listType = "cards"
}: { 
  bookings: Booking[],
  onCancelBooking: (id: string) => void,
  listType?: "cards" | "userTable"
}) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No bookings found</p>
      </div>
    );
  }

  if (listType === "userTable") {
    return <PastBookingsByUser bookings={bookings} />;
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
