export interface DbOrganization {
  id?: string;
  name: string;
  description: string;
  slug: string;
  websiteUrl?: string;
  logoUrl?: string;
  external_id: string;
  createdBy: string;
  batch_id?: string;
}

export interface DbCollection {
  id?: string;
  name: string;
  description: string;
  external_id: string;
  createdBy: string;
  batch_id?: string;
}

export interface Skill {
  name: string;
  description?: string;
  experience?: string;
}

export interface DbJob {
  duration?: string;
  id?: string;
  title: string;
  description: string;
  slug: string;
  skills: Skill[];
  external_id: string;
  organizationId: string;
  createdBy: string;
  status: string;
  batch_id?: string;
}

export interface SyncPayload {
  organization: DbOrganization;
  collections: DbCollection[];
  jobs: DbJob[];
  relationships: {
    organizationCollections: {
      organizationId: string;
      collectionId: string;
      group: string;
    }[];
    collectionOrganizations: { collectionId: string; organizationId: string }[];
    collectionJobs: { collectionId: string; jobId: string }[];
  };
  batch_id: string;
}

export interface PageLayout {
  id?: string;
  name: string;
  slug: string;
  structure: PageSection[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageSection {
  type: "announcement" | "list";
  order: number;
  data: AnnouncementData | ListData;
}

export interface AnnouncementData {
  title: string;
  content: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface ListData {
  title: string;
  listType: "jobs" | "organizations";
  variant: "scroll" | "grid";
  items: string[];
}

export interface YamlOrganization {
  name: string;
  description: string;
  slug: string;
  website?: string;
  logo_url?: string;
  external_id: string;
  collections?: Array<string | YamlCollection>;
}

export interface YamlCollection {
  name: string;
  description: string;
  external_id: string;
  group?: string;
  jobs?: Array<string | YamlJob>;
}

export interface YamlJob {
  title: string;
  description: string;
  slug: string;
  skills?: Skill[];
  external_id: string;
  duration?: string;
}
