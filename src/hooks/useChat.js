import { useSearchParams } from "next/navigation";
import { useCurrentOrganization } from "./useCurrentOrganization";
import { useCallback, useEffect, useState } from "react";
import { useOrganizationMembers } from "./useOrganizationMembers";
import { subscriptionManager } from "@/lib/exoquic_client";

export function useChat() {
	const searchParams = useSearchParams();

	const { currentOrganization } = useCurrentOrganization();
	const members = useOrganizationMembers(currentOrganization?.id);

	// The user we are chatting with
	const [chattingWithUser, setChattingWithUser] = useState(null);
	
	// The messages in the chat
	const [chatMessages, setChatMessages] = useState([]);
	
	// useEffect for subscribing to the chat messages topic, i.e. retrieving all the old
	// chat messages between the two users and all the new messages, storing them in the
	// chatMessages state.
  useEffect(() => {
    if (!currentOrganization) return;

		const chattingWithUser = searchParams.get('chattingWithUser');
		if (!chattingWithUser) return;

		const member = members.find(member => member.login === chattingWithUser);
		if (!member) return;

		setChattingWithUser(member);

		let chatMessagesSubscriber;

		const getChatMessages = async () => {
      try {
				console.log("Getting chat messages for", member.login);
				chatMessagesSubscriber = await subscriptionManager.authorizeSubscriber({
					organizationId: currentOrganization.id,
					username: member.login,
					topic: "chat",
				});

				chatMessagesSubscriber.subscribe(chatMessage => {
					console.log("Chat message received", chatMessage.data);
					setChatMessages(prevMessages => [...prevMessages, JSON.parse(chatMessage.data)]);
				});

      } catch (error) {
        console.error('Error fetching subscription token:', error);
      }
    };

    getChatMessages(); // Fetch the subscription token for chat messages

		return () => {
			if (chatMessagesSubscriber) {
				console.log("Unsubscribing from chat messages for", member.login);
				chatMessagesSubscriber.unsubscribe();
			}
			setChatMessages([]);
			setChattingWithUser(null);
		}

  }, [currentOrganization, searchParams, members]);

	const sendMessage = useCallback(async (message) => {
		await fetch("/api/v1/send-message", {
			method: "POST",
			body: JSON.stringify({ organizationId: currentOrganization.id, username: chattingWithUser.login, message }),
		});
	}, [currentOrganization, chattingWithUser]);

  return { chattingWithUser, chatMessages, sendMessage };
}
