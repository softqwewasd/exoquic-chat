import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { exoquicPublisher } from "@/lib/exoquic_server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    const { organizationId, username, message, teamId } = await request.json();

    let channel;
    let channelActivity;
    if (username) {
      const usernames = [session.user.login, username].sort();
      channel = `chat-for-${organizationId}-between-users-${usernames[0]}-and-${usernames[1]}`;
      channelActivity = `chat-activity-message-received-for-${username}-in-${organizationId}`;
      // Send a 'message-received' event to the user
      await exoquicPublisher.publish({ topic: "chat-activity", payload: JSON.stringify({ activity: "message-received", by: session.user.login }) });

    } else if (teamId) {
      channel = `chat-for-${organizationId}-for-team-${teamId}`;
    } else {
      throw new Error("No user or team to chat with");
    }

    await exoquicPublisher.publish({ topic: "chat", payload: JSON.stringify({ message, from: session.user.login }), channel });

		return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error('Error in send message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}