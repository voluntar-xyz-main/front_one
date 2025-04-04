import { Link } from "react-router-dom";
import { useCollectionsQuery } from "../data/hooks/queries/useCollections";
import { Collection_Card_Variant2 } from "./shared/Cards";
import { LoadingMessage, NotFoundMessage, SectionList } from "./shared/Layout";
import { linkToCreateCollection } from "../config/destinationsLinks";

const CreateCollectionButton = () => (
  <Link
    to={linkToCreateCollection()}
    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
  >
    Create Collection
  </Link>
);

const CollectionListHeader = () => (
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-900">My Collections</h1>
    <CreateCollectionButton />
  </div>
);

const CollectionListContent = ({ collections }) => (
  <div className="space-y-8">
    <CollectionListHeader />
    <SectionList
      items={collections}
      emptyMessage="No collections yet. Create your first collection to get started!"
      variant="grid"
      Component={Collection_Card_Variant2}
      hideWhenEmpty={false}
    />
  </div>
);

export default function CollectionList() {
  const {
    data: collections,
    isLoading: loading,
    error,
  } = useCollectionsQuery();

  if (loading) return <LoadingMessage />;
  if (error) return <NotFoundMessage message={error} />;

  return <CollectionListContent collections={collections} />;
}
