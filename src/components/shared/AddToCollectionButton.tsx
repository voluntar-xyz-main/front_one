import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { FolderHeart, Plus, X } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import { useCollectionSelector } from "../../data/hooks/CollectionSelectorHook";
import { linkToCreateCollection } from "../../config/destinationsLinks";

interface CollectionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string;
  organizationId?: string;
  collectionId?: string;
}

const CollectionSelector = memo(function CollectionSelector({
  isOpen,
  onClose,
  jobId,
  organizationId,
  collectionId,
}: CollectionSelectorProps) {
  const { collections, loading, error, handleAddToCollection } =
    useCollectionSelector(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
              <FolderHeart className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Add to Collection
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Choose a collection to add this item to:
                </p>
              </div>
            </div>
          </div>

          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

          <div className="mt-5 space-y-2">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No collections found.</p>
                <Link
                  type="button"
                  to={linkToCreateCollection()}
                  className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create a collection
                </Link>
              </div>
            ) : (
              collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleAddToCollection(collection.id)}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-white"
                    style={{ backgroundColor: collection.primaryColor }}
                  >
                    <FolderHeart className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {collection.name}
                    </p>
                    {collection.description && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {collection.description}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

interface AddToCollectionButtonProps {
  jobId?: string;
  organizationId?: string;
  collectionId?: string;
  variant?: "icon" | "full";
  className?: string;
}

export default function AddToCollectionButton({
  jobId,
  organizationId,
  collectionId,
  variant = "full",
  className = "",
}: AddToCollectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center ${
          variant === "icon"
            ? "p-2 hover:bg-gray-100 rounded-full"
            : "px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
        } ${className}`}
        title="Add to collection"
      >
        <FolderPlus
          className={variant === "icon" ? "w-5 h-5" : "w-5 h-5 mr-2"}
        />
        {variant === "full" && <span>Add to collection</span>}
      </button>

      <CollectionSelector
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        jobId={jobId}
        organizationId={organizationId}
        collectionId={collectionId}
      />
    </>
  );
}
