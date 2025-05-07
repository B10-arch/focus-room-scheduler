
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  Clock,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Simplified navigation - only Book Room and Dashboard
  const navItems = [
    { name: "Book Room", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Focus Room</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="ml-10 hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                    <Clock className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">Focus Room</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        to={item.href}
                        className="block py-2 text-base"
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <Separator />
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
