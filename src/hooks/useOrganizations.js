"use client"

import { fetchPermissionGrantedOrgs } from "@/lib/github";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const { data: session, status } = useSession();
	
	useEffect(() => {
		if (status !== "authenticated") {
			console.log("Not authenticated");
			return;
		}

		if (!session.accessToken) {
			console.log("No access token");
			return;
		}

		const fetchOrganizations = async () => {
			const organizationListData = await fetchPermissionGrantedOrgs(session.accessToken);
			const organizations = organizationListData.map(organizationData => organizationData.organization);
			setOrganizations(organizations);
		}

		fetchOrganizations();

	}, [session, status]);


	return organizations;
}