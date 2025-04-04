import {
  Briefcase,
  Building2,
  FolderHeart,
  Search as SearchIcon,
} from "lucide-react";
import { useSearch } from "../data/hooks/SearchHook";
import {
  Collection_Card_Variant1,
  Job_Card_Variant1,
  Organization_Card_Variant1,
} from "./shared/Cards";
import {
  LoadingMessage,
  LoadingPlaceholder,
  Section,
  SectionList,
} from "./shared/Layout";

type SearchType = "all" | "jobs" | "organizations" | "collections";

const SearchInput = ({ value, onChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <SearchIcon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const SearchTypeButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
      active
        ? "bg-indigo-100 text-indigo-800"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    <Icon className="w-4 h-4 mr-1.5" />
    {label}
  </button>
);

const SearchFilters = ({ searchType, onTypeChange }) => {
  const searchTypes = [
    { id: "all", label: "All", icon: SearchIcon },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "organizations", label: "Organizations", icon: Building2 },
    { id: "collections", label: "Collections", icon: FolderHeart },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {searchTypes.map(({ id, label, icon }) => (
        <SearchTypeButton
          key={id}
          id={id}
          label={label}
          icon={icon}
          active={searchType === id}
          onClick={() => onTypeChange(id as SearchType)}
        />
      ))}
    </div>
  );
};

const SearchHeader = ({ query, onQueryChange, searchType, onTypeChange }) => (
  <Section className="bg-white shadow-sm rounded-lg p-6">
    <div className="space-y-4">
      <SearchInput value={query} onChange={onQueryChange} />
      <SearchFilters searchType={searchType} onTypeChange={onTypeChange} />
    </div>
  </Section>
);

const ResultsCount = ({ total, query }) => {
  if (!query.trim()) return null;

  return (
    <div className="text-sm text-gray-500 mb-4">
      Found {total} result{total !== 1 ? "s" : ""}
    </div>
  );
};

const SearchResults = ({ loading, query, searchType, results }) => {
  const { jobs, organizations, collections } = results;
  const total = jobs.length + organizations.length + collections.length;

  return (
    <div className="space-y-8">
      {loading && <LoadingPlaceholder />}

      <ResultsCount total={total} query={query} />

      <SectionList
        items={collections}
        type="collections"
        title="Collections"
        icon={FolderHeart}
        variant="grid"
        Component={Collection_Card_Variant1}
        visible={searchType === "all" || searchType === "collections"}
        hideWhenEmpty={searchType !== "collections"}
      />

      <SectionList
        items={organizations}
        type="organizations"
        title="Organizations"
        icon={Building2}
        variant="grid"
        Component={Organization_Card_Variant1}
        visible={searchType === "all" || searchType === "organizations"}
        hideWhenEmpty={searchType !== "organizations"}
      />

      <SectionList
        items={jobs}
        type="jobs"
        title="Jobs"
        icon={Briefcase}
        variant="stack"
        Component={Job_Card_Variant1}
        visible={searchType === "all" || searchType === "jobs"}
        hideWhenEmpty={searchType !== "jobs"}
      />

      {total === 0 && (
        <div className="text-center py-8 text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};

export default function Search() {
  const { searchType, setSearchType, query, setQuery, loading, results } =
    useSearch();

  return (
    <div className="space-y-6">
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        searchType={searchType}
        onTypeChange={setSearchType}
      />
      <SearchResults
        loading={loading}
        query={query}
        searchType={searchType}
        results={results}
      />
    </div>
  );
}
