"use client"

import { fetchTeams } from "@/lib/github";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useTeams(orgId) {
  const [teams, setTeams] = useState([]);
  const { data: session, status } = useSession();
	
	useEffect(() => {
		if (!orgId) {
			console.log("No organization ID");
			return;
		}

		if (status !== "authenticated") {
			console.log("Not authenticated");
			return;
		}

		if (!session.accessToken) {
			console.log("No access token");
			return;
		}

		const fetchTeams_ = async () => {
			const teams = await fetchTeams(orgId, session.accessToken);
			setTeams(teams);
		}

		fetchTeams_();

	}, [session, status, orgId]);


	return teams;
}