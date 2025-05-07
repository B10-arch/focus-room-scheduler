
import { Link } from "react-router-dom";
import { CalendarIcon, Check, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  const features = [
    {
      title: "Easy Booking",
      description: "Book the Focus Conference Room in just a few clicks",
      icon: CalendarIcon,
    },
    {
      title: "Email Notifications",
      description: "Get booking confirmations and reminders via email",
      icon: Clock,
    },
    {
      title: "Manage Your Bookings",
      description: "View, edit, or cancel your bookings from your dashboard",
      icon: Check,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-accent">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Focus Conference Room
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Book our premium conference space for your important meetings.
                  Modern amenities, comfortable seating, and professional atmosphere.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link to="/book">Book Now</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="mx-auto h-16 w-16 mb-4 text-primary" />
                      <h2 className="text-2xl md:text-3xl font-bold">Premium Conference Space</h2>
                      <p className="text-muted-foreground mt-2">Available 7 days a week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Features and Amenities
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need for productive meetings and presentations.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-card text-card-foreground transition-all hover:shadow-md"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to book your meeting?
            </h2>
            <p className="max-w-[600px] md:text-xl">
              Create an account or sign in to book the Focus Conference Room for your next meeting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/book">Book Now</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
