import {
  Building2,
  Calendar,
  FolderHeart,
  MapPin,
  Briefcase,
  Image,
} from "lucide-react";
import { Link } from "react-router-dom";
import AddToCollectionButton from "./AddToCollectionButton";
import { DateTime, Duration } from "./DateTime";
import {
  linkToCollection,
  linkToJob,
  linkToOrganization,
} from "../../config/destinationsLinks";

export const Collection_Card_Variant1 = ({ data }) => {
  const collectionIcon = (
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
      style={{ backgroundColor: data.primaryColor || "#4F46E5" }}
    >
      <FolderHeart className="w-6 h-6" />
    </div>
  );

  const description = data.description && (
    <p className="text-sm text-gray-500 line-clamp-2">{data.description}</p>
  );

  return (
    <div className="relative group">
      <Link
        to={linkToCollection(data.id)}
        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
      >
        <div className="flex items-center space-x-4">
          {collectionIcon}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{data.name}</h3>
            {description}
          </div>
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <AddToCollectionButton collectionId={data.id} variant="icon" />
      </div>
    </div>
  );
};

export const Job_Card_Variant1 = ({ data }) => {
  return (
    <div className="relative group">
      <Link
        to={linkToJob(data.id)}
        className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{data.title}</h3>
            <div className="mt-1 flex items-center space-x-4">
              <DateTime date={data.postedAt} prefix="Posted" />
              {data.locationName && (
                <span className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {data.locationName}
                </span>
              )}
            </div>
          </div>
          {data.deadline && (
            <DateTime
              date={data.deadline}
              prefix="Closes"
              className="text-sm text-red-600"
            />
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.skills?.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {skill.name} • {skill.level}
            </span>
          ))}
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <AddToCollectionButton jobId={data.id} variant="icon" />
      </div>
    </div>
  );
};

export const Organization_Card_Variant1 = ({ data }) => {
  const logo = data.logoUrl ? (
    <img
      src={data.logoUrl}
      alt={data.name}
      className="w-12 h-12 rounded-full object-cover"
    />
  ) : (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white"
      style={{ backgroundColor: data.primaryColor || "#4F46E5" }}
    >
      <Building2 className="w-6 h-6" />
    </div>
  );

  const location = data.locationName && (
    <p className="text-sm text-gray-500 flex items-center mt-1">
      <MapPin className="w-4 h-4 mr-1" />
      {data.locationName}
    </p>
  );

  return (
    <div className="relative group">
      <Link
        to={linkToOrganization(data.id)}
        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
      >
        <div className="flex items-center space-x-4">
          {logo}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{data.name}</h3>
            {location}
          </div>
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <AddToCollectionButton organizationId={data.id} variant="icon" />
      </div>
    </div>
  );
};

export const Collection_Card_Variant2 = ({ data: collection }) => {
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
        backgroundColor: collection.primaryColor || "#4F46E5",
        color: collection.secondaryColor || "#818CF8",
      }}
    >
      <Image className="w-12 h-12 opacity-50" />
    </div>
  );

  const description = collection.description && (
    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
      {collection.description}
    </p>
  );

  const stats = (
    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
      <span className="flex items-center">
        <Briefcase className="w-4 h-4 mr-1" />
        {collection.jobs?.length || 0} Jobs
      </span>
      <span className="flex items-center">
        <Building2 className="w-4 h-4 mr-1" />
        {collection.organizations?.length || 0} Organizations
      </span>
    </div>
  );

  return (
    <Link
      to={linkToCollection(collection.id)}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
        {coverImage}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{collection.name}</h3>
        {description}
        {stats}
      </div>
    </Link>
  );
};

export const Job_Card_Variant2 = ({ data }) => {
  return (
    <div className="relative group w-80 flex-none">
      <Link
        to={linkToJob(data.id)}
        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
          <img
            src={
              data.image || `https://picsum.photos/400/225?random=${data.id}`
            }
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
            {data.title}
          </h3>
          <div className="mt-2 space-y-2">
            <DateTime date={data.postedAt} prefix="Posted" />
            {data.locationName && (
              <span className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {data.locationName}
              </span>
            )}
            {data.duration && (
              <Duration duration={data.duration} className="text-sm" />
            )}
          </div>
          {data.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {data.description}
            </p>
          )}
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <AddToCollectionButton jobId={data.id} variant="icon" />
      </div>
    </div>
  );
};

export const Organization_Card_Variant2 = ({ data }) => {
  return (
    <div className="relative group w-80 flex-none">
      <Link
        to={linkToOrganization(data.id)}
        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
          <img
            src={
              data.coverImage ||
              `https://picsum.photos/400/225?random=${data.id}`
            }
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt={data.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{data.name}</h3>
              {data.locationName && (
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {data.locationName}
                </p>
              )}
            </div>
          </div>
          {data.description && (
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {data.description}
            </p>
          )}
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <AddToCollectionButton organizationId={data.id} variant="icon" />
      </div>
    </div>
  );
};
