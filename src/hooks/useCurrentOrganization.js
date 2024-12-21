"use client";

import { useContext } from "react";
import { OrganizationContext } from "@/contexts/OrganizationContext";

export function useCurrentOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}