import { useOrganizationsQuery } from "./queries/useOrganizations";

export function useOrganizationList() {
  const {
    data: organizations = [],
    isLoading: loading,
    error,
  } = useOrganizationsQuery();
  return { organizations, loading, error: error?.message || null };
}
