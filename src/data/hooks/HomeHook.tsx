import { usePageLayout } from "./queries/usePageLayouts";

export function useHome() {
  const { data, isLoading: loading, error } = usePageLayout("home");

  return {
    currentLayout: data?.layout || null,
    currentContent: data?.content || { jobs: [], organizations: [] },
    loading,
    error: error?.message || null,
  };
}
