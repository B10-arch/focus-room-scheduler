
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Clock className="h-5 w-5 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left">
            © {new Date().getFullYear()} Focus Conference Room. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-4 text-sm">
            <Link to="/terms" className="text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
