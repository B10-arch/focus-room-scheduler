
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toZonedTime } from "date-fns-tz";

type BookingTimerProps = {
  endTime: string;
};

export function BookingTimer({ endTime }: BookingTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  
  const [isActive, setIsActive] = useState(true);
  const timeZone = "Asia/Kathmandu"; // Nepal Standard Time

  useEffect(() => {
    // Convert endTime to Nepal Standard Time
    const endDate = new Date(endTime);
    
    const calculateTimeLeft = () => {
      // Get current time in Nepal Standard Time
      const now = toZonedTime(new Date(), timeZone);
      
      // Convert end time to Nepal Standard Time for consistent comparison
      const nepalEndDate = toZonedTime(endDate, timeZone);
      
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
    };
    
    // Calculate immediately and then set interval
    calculateTimeLeft();
    
    const timerId = setInterval(calculateTimeLeft, 1000);
    
    // Cleanup on unmount
    return () => clearInterval(timerId);
  }, [endTime, timeZone]);
  
  if (!timeLeft) {
    return (
      <Badge variant="outline" className="bg-muted">
        Booking Ended
      </Badge>
    );
  }
  
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
