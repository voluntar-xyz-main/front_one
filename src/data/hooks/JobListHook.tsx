import { useState } from "react";
import { useJobsQuery } from "./queries/useJobs";

export function useJobList() {
  const [searchParams] = useState({
    query: "",
    categoryIds: [],
    skillIds: [],
  });

  const {
    data: jobs = [],
    isLoading: loading,
    error,
  } = useJobsQuery(searchParams);

  return { jobs, loading, error: error?.message || null };
}
