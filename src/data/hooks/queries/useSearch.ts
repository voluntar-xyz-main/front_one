import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

type SearchType = "all" | "jobs" | "organizations" | "collections";

export const searchKeys = {
  all: ["search"] as const,
  results: () => [...searchKeys.all, "results"] as const,
  result: (query: string, searchType: string) =>
    [...searchKeys.results(), query, searchType] as const,
};

export const useSearchQuery = (query: string, searchType: SearchType) => {
  return useQuery({
    queryKey: searchKeys.result(query, searchType),
    queryFn: () => api.searchAll(query, searchType),
    enabled: !!query.trim(),
    staleTime: 1000 * 60,
  });
};
