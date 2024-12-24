import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { exoquicPublisher } from "@/lib/exoquic_server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    const { organizationId, username, activity } = await request.json();

		if (activity !== "typing-started" && activity !== "typing-stopped" && activity !== "messages-read") {
			return NextResponse.json({ error: 'Invalid activity' }, { status: 400 });
		}

		let channel;
		if (activity === "messages-read") {
			channel = `chat-activity-message-received-for-${session.user.login}-in-${organizationId}`;
		} else {
			channel = `chat-activity-typing-for-${username}-in-${organizationId}`;
		}

		const payload = {
			activity: activity,
			by: session.user.login,
			for: username,
		}

    await exoquicPublisher.publish({ topic: "chat-activity", payload: JSON.stringify(payload), channel });
		
		return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error('Error in send message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}