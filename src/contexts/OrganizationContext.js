import { createContext, useContext, useState, useEffect } from 'react';

const OrganizationContext = createContext();

const LOCAL_STORAGE_KEY = "currentOrganization";

export function OrganizationProvider({ children }) {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState(null);

  useEffect(() => {
    if (!window) {
      return;
    }

    if (!hasInitialized) {
      setHasInitialized(true);
      const storedOrg = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      setCurrentOrganization(storedOrg ? JSON.parse(storedOrg) : null);
      return;
    }

    if (currentOrganization) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentOrganization));
    } else {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [currentOrganization, hasInitialized]);

  return (
    <OrganizationContext.Provider value={{ currentOrganization, setCurrentOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
}

// Custom hook to use the organization context
export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
} 