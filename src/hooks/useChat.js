import { useSearchParams } from "next/navigation";
import { useCurrentOrganization } from "./useCurrentOrganization";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useOrganizationMembers } from "./useOrganizationMembers";
import { SubscriptionManager } from "@exoquic/sub"

const subscriptionManager = new SubscriptionManager(async ({ organizationId, username }) => {
  const response = await fetch("/api/v1/authorize-subscribers", {
    method: "POST",
    body: JSON.stringify({ organizationId, username }),
  });
  const data = await response.json();
  return data.subscriptionToken;
}, { env: "dev" });

export function useChat() {
  const { data: session } = useSession();
	const searchParams = useSearchParams();

	const { currentOrganization } = useCurrentOrganization();
	const members = useOrganizationMembers(currentOrganization?.id);

	const [chattingWithUser, setChattingWithUser] = useState(null);
	const [chatMessages, setChatMessages] = useState([]);
	

  useEffect(() => {
    if (!currentOrganization) return;

		// Get the user to chat with from the search params
		const chattingWithUser = searchParams.get('chattingWithUser');
		if (!chattingWithUser) return;

		console.log("Chatting with user (unknown)", chattingWithUser);
		// Make sure the user is a member of the organization
		const member = members.find(member => member.login === chattingWithUser);
		if (!member) return;

		console.log("Chatting with user", member.login);

		setChattingWithUser(member);

		// Get chat messages from exoquic
		const getChatMessages = async () => {
      try {
				console.log("Getting chat messages for", member.login);
				const subscriber = await subscriptionManager.authorizeSubscriber({
					organizationId: currentOrganization.id,
					username: member.login,
				});

				subscriber.subscribe(chatMessage => {
					setChatMessages(prevMessages => [...prevMessages, chatMessage]);
				});

      } catch (error) {
        console.error('Error fetching subscription token:', error);
      }
    };

    getChatMessages(); // Fetch the subscription token

  }, [currentOrganization, searchParams, members]);

  return { chattingWithUser, chatMessages };
}
