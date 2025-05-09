
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  bookingDetails: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    bookedBy: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, bookingDetails }: EmailRequest = await req.json();
    
    if (!to || to.length === 0) {
      throw new Error("No recipients provided");
    }

    // Format date and time for email
    const startDate = new Date(bookingDetails.startTime);
    const endDate = new Date(bookingDetails.endTime);
    
    const formattedStartDate = startDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const formattedStartTime = startDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
    
    const formattedEndTime = endDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });

    console.log(`Sending email to: ${to.join(", ")}`);
    
    const emailResponse = await resend.emails.send({
      from: "Focus Room Scheduler <onboarding@resend.dev>",
      to: to,
      subject: subject,
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 15px;">${bookingDetails.title}</h1>
          
          <div style="margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedStartDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
            <p style="margin: 5px 0;"><strong>Booked by:</strong> ${bookingDetails.bookedBy}</p>
          </div>
          
          ${bookingDetails.description ? 
            `<div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <h3 style="margin-top: 0;">Description</h3>
              <p>${bookingDetails.description}</p>
            </div>` : ''
          }
          
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This is an automated message from the Focus Conference Room Scheduler.</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
