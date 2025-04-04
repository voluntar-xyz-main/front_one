import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const pageLayoutKeys = {
  all: ["pageLayouts"] as const,
  detail: (slug: string) => [...pageLayoutKeys.all, slug] as const,
};

export const usePageLayout = (slug: string) => {
  return useQuery({
    queryKey: pageLayoutKeys.detail(slug),
    queryFn: () => api.getPageLayoutWithContent(slug),
    enabled: !!slug,
  });
};
