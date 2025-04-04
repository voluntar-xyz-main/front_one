import { useState } from "react";
import {
  useAddToCollectionMutation,
  useCollectionsQuery,
} from "./queries/useCollections";

export function useCollectionSelector(onClose: () => void) {
  const { data: collections = [], isLoading: loading } = useCollectionsQuery();
  const addToCollectionMutation = useAddToCollectionMutation();
  const [error, setError] = useState<string | null>(null);

  const handleAddToCollection = async (params: {
    collectionId: string;
    jobId?: string;
    organizationId?: string;
    subCollectionId?: string;
  }) => {
    try {
      await addToCollectionMutation.mutateAsync(params);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add to collection"
      );
    }
  };

  return {
    collections,
    loading,
    error,
    handleAddToCollection,
  };
}
