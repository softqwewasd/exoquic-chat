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

	// Whether this user is typing, sends an chat-activity to the server
	// when the state changes.
	const [isTyping, setIsTyping] 	= useState(false);

	// Whether the user they're chatting with is typing
	const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

	const [missedMessages, setMissedMessages] = useState({});

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
				topic: "chat-activity-typing",
			});

			chatActivitySubscriber.subscribe(chatActivity => {
				const activityData = JSON.parse(chatActivity.data);

				if (activityData.by === chattingWithUser && activityData.activity === "typing-started") {
					setIsOtherUserTyping(true);
				} else if (activityData.by === chattingWithUser && activityData.activity === "typing-stopped") {
					setIsOtherUserTyping(false);
				}

				if (activityData.by !== session.user.login && activityData.activity === "message-received") {
					setMissedMessages(prev => ({ ...prev, [chattingWithUser]: missedMessages[chattingWithUser] + 1 }));
				}
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

	}, [currentOrganization, searchParams, members]);

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
			body: JSON.stringify({ organizationId: currentOrganization.id, username: member.login, activity: isTyping ? "typing-started" : "typing-stopped" }),
		});
	}, [isTyping]);

	return {
		isTyping,
		isOtherUserTyping,
		setIsTyping,
		missedMessages,
	}
}