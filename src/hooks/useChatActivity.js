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

	const [isTyping, setIsTyping] 	= useState(false);
	const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
	const [missedMessages, setMissedMessages] = useState({});


	// useEffect for subscribing to the chat activity topic. We create two subscribers,
	// one for the typing events and one for the 'message received' and 'message read' events.
	useEffect(() => {
		if (!currentOrganization) return;

		const chattingWithUser = searchParams.get('chattingWithUser');
		if (!chattingWithUser) return;

		const member = members.find(member => member.login === chattingWithUser);
		if (!member) return;

		let chatActivityForTypingSubscriber;
		let chatActivityForMessageReceivedSubscriber;
		
		const getChatActivityForTyping = async () => {
			chatActivityForTypingSubscriber = await subscriptionManager.authorizeSubscriber({
				organizationId: currentOrganization.id,
				username: session.user.login,
				topic: "chat-activity-typing",
			});

			chatActivityForTypingSubscriber.subscribe(chatActivity => {
				const activityData = JSON.parse(chatActivity.data);

				if (activityData.by === chattingWithUser && activityData.activity === "typing-started") {
					setIsOtherUserTyping(true);
				} else if (activityData.by === chattingWithUser && activityData.activity === "typing-stopped") {
					setIsOtherUserTyping(false);
				}
			});
			
		};

		const getChatActivityForMessageReceived = async () => {
			chatActivityForMessageReceivedSubscriber = await subscriptionManager.authorizeSubscriber({
				organizationId: currentOrganization.id,
				username: session.user.login,
				topic: "chat-activity-message-received",
			});

			chatActivityForMessageReceivedSubscriber.subscribe(chatActivity => {
				const activityData = JSON.parse(chatActivity.data);
				if (activityData.by !== session.user.login && activityData.activity === "message-received") {
					setMissedMessages(prev => ({ ...prev, [activityData.by]: (prev[activityData.by] ?? 0) + 1 }));
				}
				if (activityData.by === session.user.login && activityData.activity === "messages-read") {
					setMissedMessages(prev => ({ ...prev, [activityData.for]: 0 }));
				}
			});
		};

		getChatActivityForTyping();
		getChatActivityForMessageReceived();

		// Unsubscribe from the chat activity topic when the component unmounts
		return () => {
			if (chatActivityForTypingSubscriber) {
				console.log("Unsubscribing from chat activity for", session.user.login);
				chatActivityForTypingSubscriber.unsubscribe();
			}
			if (chatActivityForMessageReceivedSubscriber) {
				console.log("Unsubscribing from chat activity for", session.user.login);
				chatActivityForMessageReceivedSubscriber.unsubscribe();
				setMissedMessages({});
			}
			setIsTyping(false);
		};

	}, [currentOrganization, searchParams, members]);

	// useEffect for sending a chat-activity to Exoquic when the user starts or stops typing
	useEffect(() => {
		const chattingWithUser = searchParams.get('chattingWithUser');
		if (!chattingWithUser) return;

		const member = members.find(member => member.login === chattingWithUser);
		if (!member) return;

		if (!currentOrganization) return;

		fetch("/api/v1/send-activity", {
			method: "POST",
			body: JSON.stringify({ organizationId: currentOrganization.id, username: member.login, activity: isTyping ? "typing-started" : "typing-stopped" }),
		});
	}, [isTyping]);

	// useEffect for sending a chat-activity to Exoquic when the user reads messages. It is assumed
	// that the user has read all the messages when they open the chat with the user.
	useEffect(() => {
		const chattingWithUser = searchParams.get('chattingWithUser');
		if (chattingWithUser && missedMessages[chattingWithUser] > 0) {
			const sendMessageReadActivity = async () => {
				await fetch("/api/v1/send-activity", {
					method: "POST",
					body: JSON.stringify({ organizationId: currentOrganization.id, activity: "messages-read", username: chattingWithUser }),
				});
			}
			sendMessageReadActivity();
		}
	}, [missedMessages[searchParams.get('chattingWithUser') ?? ''] ?? null, searchParams.get('chattingWithUser')]);

	return {
		isTyping,
		isOtherUserTyping,
		setIsTyping,
		missedMessages,
	}
}