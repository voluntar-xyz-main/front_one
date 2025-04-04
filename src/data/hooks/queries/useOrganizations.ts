import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Organization } from "../../types";

export const organizationKeys = {
  all: ["organizations"] as const,
  lists: () => [...organizationKeys.all, "list"] as const,
  list: () => [...organizationKeys.lists()] as const,
  details: () => [...organizationKeys.all, "detail"] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
};

export const useOrganizationsQuery = () => {
  return useQuery({
    queryKey: organizationKeys.list(),
    queryFn: () => api.getOrganizations(),
  });
};

export const useOrganizationDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => api.getOrganizationWithDetails(id),
    enabled: !!id,
  });
};

export const useCreateOrganizationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (organization: Partial<Organization>) => {
      const { user } = await api.getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      return api.createOrganization({
        ...organization,
        createdBy: user.id,
      });
    },
    onSuccess: (newOrganization) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
};
