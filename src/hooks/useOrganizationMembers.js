
import { fetchOrgMembers } from "@/lib/github";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useOrganizationMembers(orgId) {
  const [members, setMembers] = useState([]);
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

		const fetchMembers = async () => {
			const members = await fetchOrgMembers(orgId, session.accessToken);
			setMembers(members);
		}

		fetchMembers();

	}, [session, status, orgId]);


	return members;

}