import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { exoquicPublisher } from "@/lib/exoquic";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    const { organizationId, activity } = await request.json();

		if (activity !== "typing-started" && activity !== "typing-stopped") {
			return NextResponse.json({ error: 'Invalid activity' }, { status: 400 });
		}

    const channel = `chat-activity-for-${session.user.login}-in-${organizationId}`;

    await exoquicPublisher.publish({ topic: "chat-activity", payload: JSON.stringify({ activity }), channel });
		
		return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error('Error in send message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}