import { useState, useEffect } from "react";
import { useSearchQuery } from "./queries/useSearch";

type SearchType = "all" | "jobs" | "organizations" | "collections";

export function useSearch() {
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim()) {
        setDebouncedQuery(query);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const {
    data: results = { jobs: [], organizations: [], collections: [] },
    isLoading: loading,
  } = useSearchQuery(debouncedQuery, searchType);

  return {
    searchType,
    setSearchType,
    query,
    setQuery,
    loading,
    results,
  };
}
