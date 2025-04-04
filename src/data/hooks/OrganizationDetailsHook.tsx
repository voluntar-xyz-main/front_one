import { useOrganizationDetailsQuery } from "./queries/useOrganizations";

export function useOrganizationDetails(id: string) {
  const { data, isLoading: loading, error } = useOrganizationDetailsQuery(id);

  return {
    organization: data?.organization || null,
    jobs: data?.jobs || [],
    collections: data?.collections || [],
    loading,
    error: error?.message || null,
  };
}
