import { useSearchParams } from "next/navigation";
import { useCurrentOrganization } from "./useCurrentOrganization";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useOrganizationMembers } from "./useOrganizationMembers";
import { subscriptionManager } from "@/lib/exoquic_client";

export function useChat() {
  const { data: session } = useSession();
	const searchParams = useSearchParams();

	const { currentOrganization } = useCurrentOrganization();
	const members = useOrganizationMembers(currentOrganization?.id);

	// The user we are chatting with
	const [chattingWithUser, setChattingWithUser] = useState(null);
	
	// The messages in the chat
	const [chatMessages, setChatMessages] = useState([]);
	

  useEffect(() => {
    if (!currentOrganization) return;

		// Get the user to chat with from the search params
		const chattingWithUser = searchParams.get('chattingWithUser');
		if (!chattingWithUser) return;

		// Make sure the user is a member of the organization
		const member = members.find(member => member.login === chattingWithUser);
		if (!member) return;

		setChattingWithUser(member);

		let chatMessagesSubscriber;
		let chatActivitySubscriber;
		// Get chat messages from exoquic
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

		getChatActivity(); // Fetch the subscription token for chat activity

		return () => {
			if (chatMessagesSubscriber) {
				console.log("Unsubscribing from chat messages for", member.login);
				chatMessagesSubscriber.unsubscribe();
			}
			if (chatActivitySubscriber) {
				console.log("Unsubscribing from chat activity for", session.user.login);
				chatActivitySubscriber.unsubscribe();
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
