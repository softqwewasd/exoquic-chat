import { useSearchParams } from "next/navigation";
import { useCurrentOrganization } from "./useCurrentOrganization";
import { useOrganizationMembers } from "./useOrganizationMembers";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { subscriptionManager } from "@/lib/exoquic_client";

export function useChatActivity() {
  const { data: session } = useSession();
	const searchParams = useSearchParams();

	const { currentOrganization } 	= useCurrentOrganization();
	const members 									= useOrganizationMembers(currentOrganization?.id);

	// Whether the user is typing, sends an chat-activity to the server
	// when the state changes.
	const [isTyping, setIsTyping] 	= useState(false);

	// useEffect for subscribing to the chat activity topic
	useEffect(() => {
		if (!currentOrganization) return;

		// Get the user to chat with from the search params
		const chattingWithUser = searchParams.get('chattingWithUser');
		if (!chattingWithUser) return;

		// Make sure the user is a member of the organization
		const member = members.find(member => member.login === chattingWithUser);
		if (!member) return;

		// Fetches the subscription token and subscribes to the chat activity topic
		let chatActivitySubscriber;
		const getChatActivity = async () => {
			chatActivitySubscriber = await subscriptionManager.authorizeSubscriber({
				organizationId: currentOrganization.id,
				username: session.user.login,
				topic: "chat-activity",
			});

			chatActivitySubscriber.subscribe(chatActivity => {
				console.log("Chat activity received", chatActivity.data);
			});
		};

		getChatActivity();

		// Unsubscribe from the chat activity topic when the component unmounts
		return () => {
			if (chatActivitySubscriber) {
				console.log("Unsubscribing from chat activity for", session.user.login);
				chatActivitySubscriber.unsubscribe();
			}
			setIsTyping(false);
		};

	}, [currentOrganization, session?.user?.login]);

	// useEffect for sending a chat-activity to Exoquic when the user starts or stops typing
	useEffect(() => {
		// Make sure the user is chatting with someone
		const chattingWithUser = searchParams.get('chattingWithUser');
		if (!chattingWithUser) return;

		// Make sure the user is a member of the organization
		const member = members.find(member => member.login === chattingWithUser);
		if (!member) return;

		// Make sure we're in an organization
		if (!currentOrganization) return;

		// Send the chat activity to the server
		fetch("/api/v1/send-activity", {
			method: "POST",
			body: JSON.stringify({ organizationId: currentOrganization.id, username: session.user.login, activity: isTyping ? "typing-started" : "typing-stopped" }),
		});
	}, [isTyping]);

	return {
		isTyping,
		setIsTyping
	}
}