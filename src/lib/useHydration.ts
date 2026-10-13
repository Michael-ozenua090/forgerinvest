"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect whether the component has successfully mounted on the client.
 * Prevents Next.js SSR hydration mismatches when displaying client-persisted or
 * dynamic backend state (e.g., balances, user plans, localized dates).
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
