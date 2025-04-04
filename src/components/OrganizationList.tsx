import { useOrganizationList } from "../data/hooks/OrganizationListHook";
import { Organization_Card_Variant1 } from "./shared/Cards";
import { LoadingMessage, NotFoundMessage, SectionList } from "./shared/Layout";

const OrganizationListHeader = () => (
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
  </div>
);

const OrganizationListContent = ({ organizations }) => (
  <div className="space-y-8">
    <OrganizationListHeader />
    <SectionList
      items={organizations}
      emptyMessage="No organizations found. Create your first organization to get started!"
      variant="grid"
      Component={Organization_Card_Variant1}
      hideWhenEmpty={false}
    />
  </div>
);

export default function OrganizationList() {
  const { organizations, loading, error } = useOrganizationList();

  if (loading) return <LoadingMessage />;
  if (error) return <NotFoundMessage message={error} />;

  return <OrganizationListContent organizations={organizations} />;
}
