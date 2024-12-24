"use client";

import { SubscriptionManager } from "@exoquic/sub";

export const subscriptionManager = new SubscriptionManager(async ({ organizationId, username, topic, teamId }) => {
  const response = await fetch("/api/v1/authorize-subscribers", {
    method: "POST",
    body: JSON.stringify({ organizationId, username, topic, teamId }),
  });
  const data = await response.json();
  return data.subscriptionToken;
}, { env: "dev" });