
import { useState, useEffect } from "react";
import { Clock, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toZonedTime } from "date-fns-tz";
import { formatDistance } from "date-fns";

type BookingTimerProps = {
  startTime: string;
  endTime: string;
};

export function BookingTimer({ startTime, endTime }: BookingTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  
  const [startTimeLeft, setStartTimeLeft] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timeZone = "Asia/Kathmandu"; // Nepal Standard Time

  useEffect(() => {
    // Convert times to Date objects
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    const calculateTimeLeft = () => {
      // Get current time in Nepal Standard Time
      const now = toZonedTime(new Date(), timeZone);
      
      // Convert start and end time to Nepal Standard Time for consistent comparison
      const nepalStartDate = toZonedTime(startDate, timeZone);
      const nepalEndDate = toZonedTime(endDate, timeZone);
      
      // Check if the booking has started
      if (now >= nepalStartDate && now < nepalEndDate) {
        // Booking is active, calculate time remaining until end
        setHasStarted(true);
        setIsActive(true);
        
        const difference = nepalEndDate.getTime() - now.getTime();
        
        if (difference <= 0) {
          setIsActive(false);
          setTimeLeft(null);
          return;
        }
        
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
        setStartTimeLeft(null);
      } else if (now < nepalStartDate) {
        // Booking hasn't started yet, calculate time until it starts
        setHasStarted(false);
        setIsActive(true);
        
        // Format "Starting in X minutes" text
        setStartTimeLeft(formatDistance(nepalStartDate, now, { addSuffix: false }));
        setTimeLeft(null);
      } else {
        // Booking has ended
        setIsActive(false);
        setTimeLeft(null);
        setStartTimeLeft(null);
      }
    };
    
    // Calculate immediately and then set interval
    calculateTimeLeft();
    
    const timerId = setInterval(calculateTimeLeft, 1000);
    
    // Cleanup on unmount
    return () => clearInterval(timerId);
  }, [startTime, endTime, timeZone]);
  
  if (!isActive) {
    return (
      <Badge variant="outline" className="bg-muted">
        Booking Ended
      </Badge>
    );
  }
  
  if (startTimeLeft && !hasStarted) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-4 flex items-center space-x-2">
          <Timer className="h-4 w-4 text-amber-500" />
          <div className="text-sm font-medium text-amber-800">
            Starting in {startTimeLeft}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (timeLeft) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4 flex items-center space-x-2">
          <Clock className="h-4 w-4 text-primary" />
          <div className="text-sm font-medium">
            Time remaining: {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
}
