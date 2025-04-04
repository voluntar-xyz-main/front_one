import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

export function useAuthProvider() {
  const [authState, setAuthState] = useState({
    user: api.auth.user,
    profile: api.auth.profile,
    loading: api.auth.loading,
  });

  useEffect(() => {
    const unsubscribe = api.auth.addListener((event) => {
      setAuthState({
        user: api.auth.user,
        profile: api.auth.profile,
        loading: api.auth.loading,
      });
    });

    const subscription = api.setAuthChangeHandler(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
      }
    });

    return () => {
      unsubscribe();
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    return {
      isAuthenticated: !!authState.user,
      isLoadingAuth: authState.loading,
      user: authState.user,
      profile: authState.profile,
    };
  }, [authState]);

  return value;
}
