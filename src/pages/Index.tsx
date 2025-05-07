
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to book page
    navigate("/book", { replace: true });
  }, [navigate]);
  
  return null;
}
