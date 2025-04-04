import { useNavigate } from "react-router-dom";
import { Image } from "lucide-react";
import { useCollectionForm } from "../data/hooks/CollectionFormHook";

export default function CollectionForm() {
  const navigate = useNavigate();
  const { formData, loading, error, handleSubmit, handleInputChange } =
    useCollectionForm();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Create New Collection
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Collection Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Cover Image URL
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value)
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-10 w-10 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "";
                    handleInputChange("imageUrl", "");
                  }}
                />
              ) : (
                <div className="h-10 w-10 rounded bg-indigo-100 flex items-center justify-center">
                  <Image className="h-6 w-6 text-indigo-600" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="primaryColor"
                className="block text-sm font-medium text-gray-700"
              >
                Primary Color
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    handleInputChange("primaryColor", e.target.value)
                  }
                  className="h-8 w-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    handleInputChange("primaryColor", e.target.value)
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="secondaryColor"
                className="block text-sm font-medium text-gray-700"
              >
                Secondary Color
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="color"
                  id="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    handleInputChange("secondaryColor", e.target.value)
                  }
                  className="h-8 w-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    handleInputChange("secondaryColor", e.target.value)
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
