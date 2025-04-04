export interface Collection {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  jobs?: Job[];
  organizations?: Organization[];
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Skill {
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Job {
  id: string;
  organizationId: string;
  title: string;
  slug: string;
  description: string;
  externalUrl?: string;
  locationName?: string;
  latitude?: number;
  skills: {
    name: string;
    level: string;
  }[];
  categories: Category[];
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  professionalSummary?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

export interface JobSearchParams {
  query?: string;
  categoryIds?: string[];
  skillIds?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  radiusKm?: number;
}

export interface PageLayout {
  id: string;
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
