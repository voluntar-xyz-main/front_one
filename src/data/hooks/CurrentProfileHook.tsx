import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useCurrentProfile() {
  const [state, setState] = useState({
    profile: api.auth.profile,
    loading: api.auth.loading,
    error: api.auth.error,
  });

  useEffect(() => {
    const unsubscribe = api.auth.addListener((event) => {
      setState({
        profile: api.auth.profile,
        loading: api.auth.loading,
        error: api.auth.error,
      });
    });

    return unsubscribe;
  }, []);

  return {
    profile: state.profile,
    loading: state.loading,
    error: state.error,
  };
}
