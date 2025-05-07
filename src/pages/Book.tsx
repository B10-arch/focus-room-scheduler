
import { BookingForm } from "@/components/booking/BookingForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Book() {
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
