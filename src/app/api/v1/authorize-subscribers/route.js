import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import * as exoquicAuth from "@exoquic/auth";
import { fetchUser } from '@/lib/github';
import { authOptions } from '../../auth/[...nextauth]/route';

// Initialize the subscription authorizer with your API key
exoquicAuth.initalizeSubscriptionAuthorizer({ apiKey: process.env.EXOQUIC_API_KEY });

// Retrieve the subscription token for the chat between the current user and the user to chat with
export async function POST(request) {
  try {
    // Get the authenticated session
    const session = await getServerSession(authOptions);
    console.log("THIS IS THE SESSION IN AUTHORIZE SUBSCRIBERS:", session);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
		const user = await fetchUser(session.accessToken);
    console.log("user", user);

    const { organizationId, username } = await request.json();
    console.log("session", session);
    const usernames = [session.user.login, username].sort();
    const channel = `chat-for-${organizationId}-between-users-${usernames[0]}-and-${usernames[1]}`;
    const subscriptionToken = await exoquicAuth.authorizeSubscription({ topic: "chat", channel: channel });
    
    return NextResponse.json({ subscriptionToken });
  } catch (error) { 
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 