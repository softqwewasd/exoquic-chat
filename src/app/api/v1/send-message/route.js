import { ExoquicPublisher } from "@exoquic/pub";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

const publisher = new ExoquicPublisher({ apiKey: process.env.EXOQUIC_API_KEY });

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    const { organizationId, username, message } = await request.json();

    const usernames = [session.user.login, username].sort();
    const channel = `chat-for-${organizationId}-between-users-${usernames[0]}-and-${usernames[1]}`;

    await publisher.publish({ topic: "chat", payload: JSON.stringify({ message, from: session.user.login }), channel });
    
		return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error('Error in send message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}