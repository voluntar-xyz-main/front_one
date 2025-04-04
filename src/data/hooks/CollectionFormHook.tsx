import { useState } from "react";
import { useCreateCollectionMutation } from "./queries/useCollections";
import type { Collection } from "../types";

export function useCollectionForm() {
  const createCollectionMutation = useCreateCollectionMutation();
  const [formData, setFormData] = useState<Partial<Collection>>({
    name: "",
    description: "",
    imageUrl: "",
    primaryColor: "#4F46E5",
    secondaryColor: "#818CF8",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const collection = await createCollectionMutation.mutateAsync(formData);
      return collection;
    } catch (err) {
      return null;
    }
  };

  const handleInputChange = (
    field: keyof Partial<Collection>,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  return {
    formData,
    loading: createCollectionMutation.isPending,
    error: createCollectionMutation.error?.message || null,
    handleSubmit,
    handleInputChange,
  };
}
