import { useJobDetailsQuery } from "./queries/useJobs";

export function useJobDetails(id: string) {
  const { data, isLoading: loading, error } = useJobDetailsQuery(id);

  return {
    job: data?.job || null,
    organization: data?.organization || null,
    loading,
    error: error?.message || null,
  };
}
