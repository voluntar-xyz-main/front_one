import { format } from "date-fns";
import { Building2, Calendar, FolderHeart, Globe, MapPin } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import AddToCollectionButton from "./shared/AddToCollectionButton";
import { LoadingMessage, NotFoundMessage, Section } from "./shared/Layout";

import { useOrganizationDetails } from "../data/hooks/OrganizationDetailsHook";
import { linkToCollection, linkToJob } from "../config/destinationsLinks";

const OrganizationLogo = ({ organization }) =>
  organization.logoUrl ? (
    <img
      src={organization.logoUrl}
      alt={organization.name}
      className="w-16 h-16 rounded-lg object-cover"
    />
  ) : (
    <div
      className="w-16 h-16 rounded-lg flex items-center justify-center text-white"
      style={{ backgroundColor: organization.primaryColor || "#4F46E5" }}
    >
      <Building2 className="w-8 h-8" />
    </div>
  );

const OrganizationActions = ({ organization }) => (
  <div className="flex items-center space-x-2">
    <AddToCollectionButton organizationId={organization.id} variant="icon" />
    {organization.websiteUrl && (
      <a
        href={organization.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Globe className="w-4 h-4 mr-2" />
        Visit Website
      </a>
    )}
  </div>
);

const OrganizationHeader = ({ organization }) => (
  <div className="flex items-start justify-between">
    <div className="flex items-center space-x-4">
      <OrganizationLogo organization={organization} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {organization.name}
        </h1>
        {organization.locationName && (
          <p className="text-gray-500 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {organization.locationName}
          </p>
        )}
      </div>
    </div>
    <OrganizationActions organization={organization} />
  </div>
);

const JobCard = ({ job }) => (
  <Link
    to={linkToJob(job.id)}
    className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Posted {format(new Date(job.postedAt), "MMM d, yyyy")}
          </span>
          {job.locationName && (
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {job.locationName}
            </span>
          )}
        </div>
      </div>
      {job.deadline && (
        <div className="text-sm text-red-600">
          Closes {format(new Date(job.deadline), "MMM d, yyyy")}
        </div>
      )}
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {(job.skills || []).map((skill, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
        >
          {skill.name} • {skill.level}
        </span>
      ))}
    </div>
  </Link>
);

const CollectionCard = ({ collection }) => {
  const collectionIcon = (
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
      style={{ backgroundColor: collection.primaryColor || "#4F46E5" }}
    >
      <FolderHeart className="w-6 h-6" />
    </div>
  );

  const description = collection.description && (
    <p className="text-sm text-gray-500 line-clamp-2">
      {collection.description}
    </p>
  );

  return (
    <Link
      to={linkToCollection(collection.id)}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-center space-x-4">
        {collectionIcon}
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {collection.name}
          </h3>
          {description}
        </div>
      </div>
    </Link>
  );
};

const CollectionGroup = ({ group, collections }) => {
  const collectionCards = collections.map((collection) => (
    <CollectionCard key={collection.id} collection={collection} />
  ));

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium capitalize">{group}</h3>
      <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collectionCards}
      </div>
    </div>
  );
};

const JobsList = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No open positions at the moment
      </p>
    );
  }

  const jobCards = jobs.map((job) => <JobCard key={job.id} job={job} />);

  return <div className="grid gap-4">{jobCards}</div>;
};

const CollectionsList = ({ collections }) => {
  const groupedCollections = collections.reduce((acc, col) => {
    acc[col.group] = [...(acc[col.group] || []), col];
    return acc;
  }, {} as Record<string, typeof collections>);

  const collectionGroups = Object.entries(groupedCollections).map(
    ([group, groupCollections]) => (
      <CollectionGroup
        key={group}
        group={group}
        collections={groupCollections}
      />
    )
  );

  return <>{collectionGroups}</>;
};

const OrganizationDetailsContent = ({ organization, jobs, collections }) => {
  const organizationDescription = organization.description && (
    <div className="mt-6 prose prose-indigo max-w-none">
      <ReactMarkdown>{organization.description}</ReactMarkdown>
    </div>
  );

  return (
    <div className="space-y-8">
      <Section className="bg-white rounded-lg shadow-sm p-6">
        <OrganizationHeader organization={organization} />
        {organizationDescription}
      </Section>

      <Section title="Collections">
        <CollectionsList collections={collections} />
      </Section>
    </div>
  );
};

export default function OrganizationDetails() {
  const { id } = useParams();
  const { organization, jobs, collections, loading, error } =
    useOrganizationDetails(id);

  if (loading) return <LoadingMessage />;
  if (error || !organization) {
    return <NotFoundMessage message={error || "Organization not found"} />;
  }

  return (
    <OrganizationDetailsContent
      organization={organization}
      jobs={jobs}
      collections={collections}
    />
  );
}
