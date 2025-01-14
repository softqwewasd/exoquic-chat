import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import * as exoquicAuth from "@exoquic/auth";
import { authOptions } from '../../auth/[...nextauth]/route';
import { v4 } from 'uuid';

// Initialize the subscription authorizer with your API key
exoquicAuth.initSubscriptionAuthorizer({ apiKey: process.env.EXOQUIC_API_KEY });

// Retrieve the subscription token for the chat between the current user and the user to chat with
export async function POST(request) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { organizationId, username, topic, teamId } = await request.json();
    
    // Handle chat subscriptions
    if (topic == "chat" && !teamId && username) {
      const subscriptionId = v4();
      return handleDirectChatSubscription(session, organizationId, username, subscriptionId);
    }

    if (topic == "chat" && teamId && !username) {
      const subscriptionId = v4();
      return handleTeamChatSubscription(session, organizationId, teamId, subscriptionId);
    }

    // Handle chat activity subscriptions
    if (topic == "chat-activity-typing") {
      return handleChatActivityTypingSubscription(session, organizationId);
    }

    if (topic == "chat-activity-message-received") {
      const subscriptionId = v4();
      return handleChatActivityMessageReceivedSubscription(session, organizationId, subscriptionId);
    }

    return NextResponse.json({ error: 'Invalid topic' }, { status: 400 });
    
  } catch (error) { 
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle subscriptions to the 'chat' topic
async function handleDirectChatSubscription(session, organizationId, username, subscriptionId) {
  const usernames = [session.user.login, username].sort();
  const channel = `chat-for-${organizationId}-between-users-${usernames[0]}-and-${usernames[1]}`;
  const subscriptionToken = await exoquicAuth.authorizeSubscription({ topic: "chat", channel, subscriptionId });
  return NextResponse.json({ subscriptionToken });
}

async function handleTeamChatSubscription(session, organizationId, teamId, subscriptionId) {
  const channel = `chat-for-${organizationId}-for-team-${teamId}`;
  const subscriptionToken = await exoquicAuth.authorizeSubscription({ topic: "chat", channel, subscriptionId });
  return NextResponse.json({ subscriptionToken });
}

// Handle subscriptions to the 'chat-activity' topic
async function handleChatActivityTypingSubscription(session, organizationId) {
  const channel = `chat-activity-typing-for-${session.user.login}-in-${organizationId}`;
  // Reset from latest event because we don't care about the history of 'typing-started' and 'typing-stopped' events.
  const subscriptionToken = await exoquicAuth.authorizeSubscription({ topic: "chat-activity", channel, resetFrom: "latest" });
  return NextResponse.json({ subscriptionToken });
}

async function handleChatActivityMessageReceivedSubscription(session, organizationId, subscriptionId) {
  const channel = `chat-activity-message-received-for-${session.user.login}-in-${organizationId}`;
  // Reset from earliest event because we want to get all the 'message-received' and 'message-read' events.
  const subscriptionToken = await exoquicAuth.authorizeSubscription({ topic: "chat-activity", channel, resetFrom: "earliest", subscriptionId });
  return NextResponse.json({ subscriptionToken });
}