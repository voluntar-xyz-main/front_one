import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

interface AppContextType {
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  user: any | null;
  profile: any | null;
  error: string | null;
}

const AppContext = React.createContext<AppContextType>({
  isAuthenticated: false,
  isLoadingAuth: true,
  user: null,
  profile: null,
  error: null,
});

export const useAppContext = () => {
  return React.useContext(AppContext);
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authState, setAuthState] = useState({
    user: api.auth.user,
    profile: api.auth.profile,
    loading: api.auth.loading,
    error: api.auth.error,
  });

  useEffect(() => {
    const unsubscribe = api.auth.addListener((event, data) => {
      setAuthState({
        user: api.auth.user,
        profile: api.auth.profile,
        loading: api.auth.loading,
        error: api.auth.error,
      });
    });

    return unsubscribe;
  }, []);

  const value = useMemo(() => {
    return {
      isAuthenticated: !!authState.user,
      isLoadingAuth: authState.loading,
      user: authState.user,
      profile: authState.profile,
      error: authState.error,
    };
  }, [authState]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
