import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  // Subscriber model doesn't have token/confirmedAt fields
  // Just redirect to thank you page
  return NextResponse.redirect(new URL("/thank-you?subscribed=1", url.origin));
}
