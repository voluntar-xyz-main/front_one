import { format } from "date-fns";
import { Building2, Calendar, ExternalLink, MapPin } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import AddToCollectionButton from "./shared/AddToCollectionButton";
import { useJobDetails } from "../data/hooks/JobDetailsHook";
import { LoadingMessage, NotFoundMessage, Section } from "./shared/Layout";
import { linkToOrganization } from "../config/destinationsLinks";

const CompanyLogo = ({ organization }) =>
  organization.logoUrl ? (
    <img
      src={organization.logoUrl}
      alt={organization.name}
      className="w-8 h-8 rounded-full"
    />
  ) : (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
      style={{ backgroundColor: organization.primaryColor || "#4F46E5" }}
    >
      <Building2 className="w-4 h-4" />
    </div>
  );

const JobSkills_Cards = ({ skills }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {(skills || []).map((skill, index) => (
      <div key={index} className="bg-indigo-50 rounded-lg p-4">
        <div className="font-medium text-indigo-900">{skill.name}</div>
        {skill.description && (
          <p className="mt-1 text-sm text-gray-600">{skill.description}</p>
        )}
        {skill.experience && (
          <p className="mt-2 text-sm font-medium text-indigo-700">
            Experience: {skill.experience}
          </p>
        )}
      </div>
    ))}
  </div>
);

const JobSkills_List = ({ skills }) => {
  const skillItems = (skills || []).map((skill, index) => {
    const experienceBadge = skill.experience && (
      <span className="ml-2 text-sm text-gray-500 whitespace-nowrap">
        ({skill.experience})
      </span>
    );

    return (
      <div key={index} className="contents">
        <div className="py-3 text-indigo-900">
          <span className="font-medium">{skill.name}</span>
          {experienceBadge}
        </div>
        <div className="py-3 text-gray-600">{skill.description || "—"}</div>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-[minmax(20px,auto)_1fr] gap-x-6 divide-y divide-gray-200">
      {skillItems}
    </div>
  );
};

const JobMetadataItem = ({ icon: Icon, children, className = "" }) => (
  <div className={`flex items-center ${className}`}>
    <Icon className="w-4 h-4 mr-2" />
    {children}
  </div>
);

const JobMetadata = ({ job }) => {
  const postedDate = format(new Date(job.postedAt), "MMM d, yyyy");
  const deadlineDate =
    job.deadline && format(new Date(job.deadline), "MMM d, yyyy");
  const locationInfo = job.locationName && (
    <JobMetadataItem icon={MapPin}>{job.locationName}</JobMetadataItem>
  );
  const deadlineInfo = deadlineDate && (
    <JobMetadataItem icon={Calendar} className="text-red-600">
      Closes {deadlineDate}
    </JobMetadataItem>
  );

  return (
    <div className="mt-8 first:mt-0 flex flex-wrap gap-6 text-sm text-gray-500">
      <JobMetadataItem icon={Calendar}>Posted {postedDate}</JobMetadataItem>
      {locationInfo}
      {deadlineInfo}
    </div>
  );
};

const OrganizationLink = ({ organization }) => {
  return (
    <Link
      to={linkToOrganization(organization.id)}
      className="mt-2 flex items-center space-x-3 text-gray-500 hover:text-gray-700"
    >
      <CompanyLogo organization={organization} />
      <span>{organization.name}</span>
    </Link>
  );
};
const JobHeader = ({ job, organization }) => {
  const companyLink = organization && (
    <OrganizationLink organization={organization} />
  );

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        {companyLink}
      </div>
      <JobActions job={job} />
    </div>
  );
};

const JobActions = ({ job }) => {
  const externalLink = job.externalUrl && (
    <a
      href={job.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      Apply Now
    </a>
  );

  return (
    <div className="flex items-center space-x-2">
      <AddToCollectionButton jobId={job.id} variant="icon" />
      {externalLink}
    </div>
  );
};

const JobDetailsContent = ({ job, organization }) => {
  const jobDescription = <ReactMarkdown>{job.description}</ReactMarkdown>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <JobHeader job={job} organization={organization} />
        <JobMetadata job={job} />
        <Section title="Required Skills">
          <JobSkills_List skills={job.skills} />
        </Section>
        <Section
          title="Job Description"
          className="prose prose-indigo max-w-none"
        >
          {jobDescription}
        </Section>
      </div>
    </div>
  );
};

export default function JobDetails() {
  const { id } = useParams();
  const { job, organization, loading, error } = useJobDetails(id);

  if (loading) return <LoadingMessage />;
  if (error || !job || !organization) {
    return <NotFoundMessage message={error || "Job not found"} />;
  }

  return <JobDetailsContent job={job} organization={organization} />;
}
