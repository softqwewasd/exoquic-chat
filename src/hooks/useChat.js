import { useSearchParams } from "next/navigation";
import { useCurrentOrganization } from "./useCurrentOrganization";
import { useCallback, useEffect, useState } from "react";
import { useOrganizationMembers } from "./useOrganizationMembers";
import { subscriptionManager } from "@/lib/exoquic_client";
import { useTeams } from "./useTeams";

export function useChat() {
	const searchParams = useSearchParams();

	const { currentOrganization } = useCurrentOrganization();
	const members = useOrganizationMembers(currentOrganization?.id);
	const teams = useTeams(currentOrganization?.id);
	console.log("These are the teams", teams);
	// The user we are chatting with
	const [chattingWithUser, setChattingWithUser] = useState(null);

	// The Github team we are chatting 
	const [chattingWithTeam, setChattingWithTeam] = useState(null);
	
	// The messages in the chat
	const [chatMessages, setChatMessages] = useState([]);
	
	// useEffect for retrieving all the old chat messages between the two users and all the new messages,
	// storing them in the chatMessages state.
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

	// useEffect for retrieving all the old and the new chat messages in the team-chat, storing them in the chatMessages state.
	useEffect(() => {
		if (!currentOrganization) return;
		const chattingWithTeam = searchParams.get('chattingWithTeam');
		if (!chattingWithTeam) return;
		
		const team = teams.find(team => team.id == chattingWithTeam);
		if (!team) return;

		setChattingWithTeam(team);

		let chatMessagesSubscriber;

		const getChatMessages = async () => {
			try {
				console.log("Getting chat messages for team ", team.id);
				chatMessagesSubscriber = await subscriptionManager.authorizeSubscriber({
					organizationId: currentOrganization.id,
					teamId: team.id,
					topic: "chat",
				});

				chatMessagesSubscriber.subscribe(chatMessage => {
					console.log("Chat message received ", chatMessage.data);
					setChatMessages(prevMessages => [...prevMessages, JSON.parse(chatMessage.data)]);
				});
			} catch (error) {
				console.error('Error fetching subscription token:', error);
			}
		}

		getChatMessages();

		return () => {
			if (chatMessagesSubscriber) {
				console.log("Unsubscribing from chat messages for team ", team.name);
				chatMessagesSubscriber.unsubscribe();
			}
			setChatMessages([]);
			setChattingWithTeam(null);
		}
	}, [currentOrganization, searchParams, teams]);

	const sendMessage = useCallback(async (message) => {
		const payload = {
			organizationId: currentOrganization.id,
			message: message,
		}

		if (!chattingWithUser && !chattingWithTeam) {
			throw new Error("No user or team to chat with");
		}

		if (chattingWithTeam) {
			payload.teamId = chattingWithTeam.id;
		}

		if (chattingWithUser) {
			payload.username = chattingWithUser.login;
		}

		await fetch("/api/v1/send-message", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}, [currentOrganization, chattingWithUser, chattingWithTeam]);

  return { chattingWithUser, chatMessages, sendMessage };
}
