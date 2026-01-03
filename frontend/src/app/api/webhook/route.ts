import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log webhook events for debugging
    console.log("Farcaster webhook received:", JSON.stringify(body, null, 2));

    // Handle different event types
    const { event } = body;

    switch (event) {
      case "frame_added":
        // User added the frame/mini app
        console.log("Frame added by user:", body.fid);
        break;
      
      case "frame_removed":
        // User removed the frame/mini app
        console.log("Frame removed by user:", body.fid);
        break;
      
      case "notifications_enabled":
        // User enabled notifications
        console.log("Notifications enabled by user:", body.fid);
        break;
      
      case "notifications_disabled":
        // User disabled notifications
        console.log("Notifications disabled by user:", body.fid);
        break;
      
      default:
        console.log("Unknown event type:", event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ status: "ok", message: "TipStream Pro webhook endpoint" });
}
