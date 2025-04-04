import { Image } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { useCollectionDetailsQuery } from "../data/hooks/queries/useCollections";
import AddToCollectionButton from "./shared/AddToCollectionButton";
import {
  Collection_Card_Variant1,
  Job_Card_Variant1,
  Organization_Card_Variant1,
} from "./shared/Cards";
import { LoadingMessage, NotFoundMessage, SectionList } from "./shared/Layout";

const CollectionHeader = ({ collection }) => {
  const coverImage = collection.imageUrl ? (
    <img
      src={collection.imageUrl}
      alt={collection.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        backgroundColor: collection.primaryColor,
        color: collection.secondaryColor,
      }}
    >
      <Image className="w-16 h-16 opacity-50" />
    </div>
  );

  const description = collection.description && (
    <div className="mt-4 prose prose-indigo max-w-none">
      <ReactMarkdown>{collection.description}</ReactMarkdown>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-w-3 aspect-h-1">{coverImage}</div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-900">
            {collection.name}
          </h1>
          <AddToCollectionButton collectionId={collection.id} variant="icon" />
        </div>
        {description}
      </div>
    </div>
  );
};

const CollectionContent = ({ collection }) => {
  const organizations = (
    <SectionList
      items={collection.organizations}
      emptyMessage="no organization added yet"
      variant="grid"
      Component={Organization_Card_Variant1}
      title="Organizations"
    />
  );

  const jobs = (
    <SectionList
      items={collection.jobs}
      emptyMessage="no job added yet"
      variant="stack"
      Component={Job_Card_Variant1}
      title="Jobs"
    />
  );

  const collections = (
    <SectionList
      items={collection.collections}
      emptyMessage="no collection added yet"
      variant="grid"
      Component={Collection_Card_Variant1}
      title="Collections"
    />
  );

  return (
    <div className="space-y-8">
      <CollectionHeader collection={collection} />

      {organizations}
      {jobs}
      {collections}
    </div>
  );
};

export default function CollectionDetails() {
  const { id } = useParams();
  const { data: collection, isLoading } = useCollectionDetailsQuery(id);

  if (isLoading) return <LoadingMessage />;
  if (!collection) return <NotFoundMessage message="Collection not found" />;

  return <CollectionContent collection={collection} />;
}
