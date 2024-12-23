import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { exoquicPublisher } from "@/lib/exoquic_server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    const { organizationId, username, message } = await request.json();

    const usernames = [session.user.login, username].sort();
    const channel = `chat-for-${organizationId}-between-users-${usernames[0]}-and-${usernames[1]}`;

    await exoquicPublisher.publish({ topic: "chat", payload: JSON.stringify({ message, from: session.user.login }), channel });
    
		// Send a 'message-received' event to the user
		await exoquicPublisher.publish({ topic: "chat-activity", payload: JSON.stringify({ activity: "message-received", by: session.user.login }), channel: `chat-activity-for-${username}-in-${organizationId}` });

		return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error('Error in send message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}