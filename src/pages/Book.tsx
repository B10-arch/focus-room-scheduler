
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Book() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      toast.error("Please sign in to book the conference room");
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container max-w-screen-xl mx-auto py-12">
        <div className="flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Book the Focus Conference Room</h1>
            <p className="text-muted-foreground mt-2">
              Fill out the form below to book the conference room for your meeting
            </p>
          </div>
          
          <BookingForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
