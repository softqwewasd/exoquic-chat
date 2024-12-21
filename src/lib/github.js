import { signIn } from "next-auth/react";


const GITHUB_URL = "https://api.github.com";

function url(path) {
	return `${GITHUB_URL}/${path}`;
}

export class HttpError extends Error {
	constructor(message, status, ...args) {
		super(message, ...args);
		this.status = status;
	}
}

export async function fetchPermissionGrantedOrgs(token) {
	const response = await fetch(url("user/memberships/orgs"), {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	if (response.status == 401) {
		signIn("github");
		return;
	}

	if (response.status != 200) {
		const errorBody = await response.json();
		const errorMessage = errorBody.message;
		const status = response.status;
		throw new HttpError(errorMessage, status);
	}

	const orgs = await response.json();
	console.log("These are the orgs, ", orgs);
	return orgs
}