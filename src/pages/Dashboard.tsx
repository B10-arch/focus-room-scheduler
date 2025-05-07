
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, PlusCircle } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking } from "@/types/booking";
import { useAuth } from "@/contexts/AuthContext";
import { getBookings, getUserBookings, cancelBooking } from "@/lib/api";
import { BookingList } from "@/components/booking/BookingList";
import { toast } from "sonner";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      toast.error("Please sign in to view your dashboard");
      navigate("/login", { replace: true });
      return;
    }

    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        let data: Booking[];
        
        if (currentUser.isAdmin) {
          // Admins can see all bookings
          data = await getBookings();
        } else {
          // Regular users only see their own bookings
          data = await getUserBookings(currentUser.id);
        }
        
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser, navigate]);

  const handleCancelBooking = async (id: string) => {
    try {
      await cancelBooking(id);
      setBookings(prev => prev.filter(booking => booking.id !== id));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const upcomingBookings = bookings.filter(
    booking => new Date(booking.endTime) > new Date()
  );

  const pastBookings = bookings.filter(
    booking => new Date(booking.endTime) <= new Date()
  );

  if (!currentUser) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container max-w-screen-xl mx-auto py-12">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              {currentUser.isAdmin ? "All Bookings" : "My Bookings"}
            </h1>
            <Button asChild>
              <a href="/book">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Booking
              </a>
            </Button>
          </div>
          
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="upcoming" className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Upcoming
                {upcomingBookings.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                    {upcomingBookings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Bookings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading bookings...</p>
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No upcoming bookings</p>
                  <Button asChild className="mt-4">
                    <a href="/book">Book Conference Room</a>
                  </Button>
                </div>
              ) : (
                <BookingList 
                  bookings={upcomingBookings} 
                  onCancelBooking={handleCancelBooking} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading bookings...</p>
                </div>
              ) : (
                <BookingList 
                  bookings={pastBookings} 
                  onCancelBooking={handleCancelBooking} 
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
