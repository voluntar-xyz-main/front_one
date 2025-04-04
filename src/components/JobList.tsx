import { useJobList } from "../data/hooks/JobListHook";
import { Job_Card_Variant1 } from "./shared/Cards";
import { LoadingMessage, NotFoundMessage, SectionList } from "./shared/Layout";

const JobListHeader = () => (
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
  </div>
);

const JobListContent = ({ jobs }) => (
  <div className="space-y-8">
    <JobListHeader />
    <SectionList
      items={jobs}
      emptyMessage="No jobs posted yet. Create your first job posting to get started!"
      variant="stack"
      Component={Job_Card_Variant1}
      hideWhenEmpty={false}
    />
  </div>
);

export default function JobList() {
  const { jobs, loading, error } = useJobList();

  if (loading) return <LoadingMessage />;
  if (error) return <NotFoundMessage message={error} />;

  return <JobListContent jobs={jobs} />;
}
