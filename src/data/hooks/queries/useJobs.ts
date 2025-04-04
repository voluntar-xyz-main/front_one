import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Job, JobSearchParams } from "../../types";

export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (params: JobSearchParams) => [...jobKeys.lists(), params] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

export const useJobsQuery = (params: JobSearchParams = {}) => {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => api.searchJobs(params),
  });
};

export const useJobDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => api.getJobWithOrganization(id),
    enabled: !!id,
  });
};

export const useCreateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (job: Partial<Job>) => api.createJob(job),
    onSuccess: (newJob) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};
