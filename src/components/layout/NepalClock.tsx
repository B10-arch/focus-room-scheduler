
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Clock as ClockIcon } from "lucide-react";

export function NepalClock() {
  const [time, setTime] = useState<Date>(new Date());
  const timeZone = "Asia/Kathmandu"; // Nepal Standard Time
  
  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Convert current time to Nepal Standard Time
  const nepalTime = toZonedTime(time, timeZone);
  const formattedTime = format(nepalTime, "HH:mm:ss");
  const formattedDate = format(nepalTime, "dd MMM yyyy");

  return (
    <div className="flex items-center space-x-2 text-sm">
      <ClockIcon className="h-4 w-4 text-primary" />
      <div>
        <div className="font-medium">{formattedTime}</div>
        <div className="text-xs text-muted-foreground">Nepal Time · {formattedDate}</div>
      </div>
    </div>
  );
}
