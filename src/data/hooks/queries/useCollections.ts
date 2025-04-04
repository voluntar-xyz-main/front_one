import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Collection } from "../../types";

export const collectionKeys = {
  all: ["collections"] as const,
  lists: () => [...collectionKeys.all, "list"] as const,
  list: (userId?: string) =>
    [...collectionKeys.lists(), userId || "current"] as const,
  details: () => [...collectionKeys.all, "detail"] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
};

export const useCollectionsQuery = (userId?: string) => {
  return useQuery({
    queryKey: collectionKeys.list(userId),
    queryFn: async () => {
      const { user } = await api.getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      return api.getCollectionsWithItems(userId || user.id);
    },
    enabled: !!userId || true,
  });
};

export const useCollectionDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => api.getCollectionWithItems(id),
    enabled: !!id,
  });
};

export const useCreateCollectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collection: Partial<Collection>) =>
      api.createCollection(collection),
    onSuccess: (newCollection) => {
      queryClient.setQueryData(
        collectionKeys.lists(),
        (oldData: Collection[] | undefined) =>
          oldData ? [...oldData, newCollection] : [newCollection]
      );
    },
  });
};

export const useAddToCollectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      collectionId: string;
      jobId?: string;
      organizationId?: string;
      subCollectionId?: string;
    }) => api.addToCollectionAndGetUpdated(params),
    onSuccess: (updatedCollection) => {
      queryClient.setQueryData(
        collectionKeys.detail(updatedCollection.id),
        updatedCollection
      );

      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
};
