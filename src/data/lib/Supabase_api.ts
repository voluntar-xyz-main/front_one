import { createClient } from "@supabase/supabase-js";
import type {
  Collection,
  Job,
  JobSearchParams,
  Organization,
  Profile,
} from "../types";
import { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export class SupabaseApi {
  async getOwnCollections() {
    const { user } = await this.getCurrentUser();
    return this.getCollectionsWithItems(user?.id);
  }
  private supabase = supabase;

  async signUp(params: {
    email: string;
    password: string;
    options?: {
      data: { full_name: string };
    };
  }) {
    const { data, error } = await this.supabase.auth.signUp(params);
    if (error) throw error;
    return data;
  }

  async signIn(params: { email: string; password: string }) {
    const { data, error } = await this.supabase.auth.signInWithPassword(params);
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  setAuthChangeHandler(
    callback: (event: string, session: any | null) => void
  ): { unsubscribe: () => void } {
    const { data } = this.supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  }

  async getCurrentUser() {
    const { data } = await this.supabase.auth.getUser();
    return data;
  }

  async getProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          const { user } = await this.getCurrentUser();
          return await this.createProfile({
            id: userId,
            email: user.email,
            full_name: user.user_metadata.full_name || "",
            skills: [],
          });
        }
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async createProfile(profile: Partial<Profile>) {
    const { data, error } = await this.supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateProfile(userId: string, profile: Partial<Profile>) {
    const { data, error } = await this.supabase
      .from("profiles")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getOrganizations() {
    const { data, error } = await this.supabase
      .from("organizations")
      .select()
      .order("name");
    if (error) throw error;
    return data;
  }

  async createOrganization(organization: Partial<Organization>) {
    const { data, error } = await this.supabase
      .from("organizations")
      .insert(organization)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getOrganizationById(id: string) {
    const { data, error } = await this.supabase
      .from("organizations")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  async getOrganizationsByUser(userId: string) {
    const { data, error } = await this.supabase
      .from("organizations")
      .select("*")
      .eq("createdBy", userId);
    if (error) throw error;
    return data;
  }

  async getOrganizationJobs(organizationId: string) {
    const { data, error } = await this.supabase
      .from("jobs")
      .select("*, categories(id, name)")
      .eq("organizationId", organizationId)
      .order("postedAt", { ascending: false });
    if (error) throw error;
    return data;
  }

  async getOrganizationCollections(organizationId: string) {
    const { data, error } = await this.supabase
      .from("organization_collections")
      .select(
        `
        *,
        collection:collections(*)
      `
      )
      .eq("organizationId", organizationId)
      .order("group")
      .order("order");

    if (error) throw error;
    return data.map((item) => ({
      ...item.collection,
      group: item.group,
      order: item.order,
    }));
  }

  async addOrganizationCollection(params: {
    organizationId: string;
    collectionId: string;
    group: string;
  }) {
    const { data, error } = await this.supabase
      .from("organization_collections")
      .insert(params)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeOrganizationCollection(
    organizationId: string,
    collectionId: string
  ) {
    const { error } = await this.supabase
      .from("organization_collections")
      .delete()
      .match({ organizationId, collectionId });

    if (error) throw error;
  }

  async getOrganizationWithDetails(id: string) {
    const [organization, jobs, collections] = await Promise.all([
      this.getOrganizationById(id),
      this.getOrganizationJobs(id),
      this.getOrganizationCollections(id),
    ]);

    return {
      organization,
      jobs,
      collections,
    };
  }

  async searchJobs(params: JobSearchParams) {
    let query = this.supabase
      .from("jobs")
      .select("*, categories(id, name)")
      .order("postedAt", { ascending: false });

    if (params.query) {
      query = query
        .textSearch("title", params.query)
        .or(`description.ilike.%${params.query}%`);
    }

    if (params.categoryIds?.length) {
      query = query.in("categoryId", params.categoryIds);
    }

    if (params.skillIds?.length) {
      const skillFilter = params.skillIds.map((skillId) => ({
        name: skillId,
      }));
      query = query.contains("skills", skillFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async createJob(job: Partial<Job>) {
    const { data, error } = await this.supabase
      .from("jobs")
      .insert(job)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getJobById(id: string) {
    const { data, error } = await this.supabase
      .from("jobs")
      .select("*, categories(id, name)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  async getJobWithOrganization(id: string) {
    const job = await this.getJobById(id);
    if (!job) throw new Error("Job not found");

    const organization = await this.getOrganizationById(job.organizationId);

    return {
      job,
      organization,
    };
  }

  async getCollections(userId: string) {
    const { data, error } = await this.supabase
      .from("collections")
      .select("*")
      .eq("createdBy", userId)
      .order("name");
    if (error) throw error;
    return data;
  }

  async getCollectionWithItems(id: string) {
    const { data: collection, error: collectionError } = await this.supabase
      .from("collections")
      .select("*")
      .eq("id", id)
      .single();
    if (collectionError) throw collectionError;

    const [jobsResponse, orgsResponse, collectionsResponse] = await Promise.all(
      [
        this.supabase
          .from("collection_jobs")
          .select(
            `
          jobId,
          job:jobs(
            id,
            title,
            description,
            locationName,
            postedAt,
            deadline,
            skills,
            categories(id, name)
          )
        `
          )
          .eq("collectionId", id),
        this.supabase
          .from("collection_organizations")
          .select(
            `
          organizationId,
          organization:organizations(
            id,
            name,
            description,
            logoUrl,
            primaryColor,
            secondaryColor,
            locationName
          )
        `
          )
          .eq("collectionId", id),
        this.supabase
          .from("collection_collections")
          .select(
            `
          subCollectionId,
          subCollection:collections!collection_collections_subCollectionId_fkey(
            id,
            name,
            description,
            imageUrl,
            primaryColor,
            secondaryColor
          )
        `
          )
          .eq("collectionId", id),
      ]
    );

    if (jobsResponse.error) throw jobsResponse.error;
    if (orgsResponse.error) throw orgsResponse.error;
    if (collectionsResponse.error) throw collectionsResponse.error;

    return {
      ...collection,
      jobs: jobsResponse.data?.map((item) => item.job).filter(Boolean) || [],
      organizations:
        orgsResponse.data?.map((item) => item.organization).filter(Boolean) ||
        [],
      collections:
        collectionsResponse.data
          ?.map((item) => item.subCollection)
          .filter(Boolean) || [],
    };
  }

  async getCollectionsWithItems(userId: string) {
    const { data: collections, error } = await this.supabase
      .from("collections")
      .select("*")
      .eq("createdBy", userId)
      .order("name");
    if (error) throw error;

    const collectionsWithItems = await Promise.all(
      collections.map(async (collection) => {
        return await this.getCollectionWithItems(collection.id);
      })
    );

    return collectionsWithItems;
  }

  async addToCollectionAndGetUpdated(params: {
    collectionId: string;
    jobId?: string;
    organizationId?: string;
    subCollectionId?: string;
  }) {
    const { collectionId, jobId, organizationId, subCollectionId } = params;

    if (jobId) {
      const { error } = await this.supabase
        .from("collection_jobs")
        .insert({ collectionId, jobId });
      if (error) throw error;
    }

    if (organizationId) {
      const { error } = await this.supabase
        .from("collection_organizations")
        .insert({ collectionId, organizationId });
      if (error) throw error;
    }

    if (subCollectionId) {
      const { error } = await this.supabase
        .from("collection_collections")
        .insert({ collectionId, subCollectionId });
      if (error) throw error;
    }

    return await this.getCollectionWithItems(collectionId);
  }

  async createCollection(collection: Partial<Collection>) {
    const { data, error } = await this.supabase
      .from("collections")
      .insert(collection)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getCollectionById(id: string) {
    const { data, error } = await this.supabase
      .from("collections")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  async addToCollection(params: {
    collectionId: string;
    jobId?: string;
    organizationId?: string;
    subCollectionId?: string;
  }) {
    const { collectionId, jobId, organizationId, subCollectionId } = params;

    if (jobId) {
      const { error } = await this.supabase
        .from("collection_jobs")
        .insert({ collectionId, jobId });
      if (error) throw error;
    }

    if (organizationId) {
      const { error } = await this.supabase
        .from("collection_organizations")
        .insert({ collectionId, organizationId });
      if (error) throw error;
    }

    if (subCollectionId) {
      const { error } = await this.supabase
        .from("collection_collections")
        .insert({ collectionId, subCollectionId });
      if (error) throw error;
    }
  }

  async getCollectionItems(collectionId: string) {
    const [jobsResponse, orgsResponse, collectionsResponse] = await Promise.all(
      [
        this.supabase
          .from("collection_jobs")
          .select(
            `
          jobId,
          job:jobs(
            id,
            title,
            description,
            locationName,
            postedAt,
            deadline,
            skills,
            categories(id, name)
          )
        `
          )
          .eq("collectionId", collectionId),
        this.supabase
          .from("collection_organizations")
          .select(
            `
          organizationId,
          organization:organizations(
            id,
            name,
            description,
            logoUrl,
            primaryColor,
            secondaryColor,
            locationName
          )
        `
          )
          .eq("collectionId", collectionId),
        this.supabase
          .from("collection_collections")
          .select(
            `
          subCollectionId,
          subCollection:collections!collection_collections_subCollectionId_fkey(
            id,
            name,
            description,
            imageUrl,
            primaryColor,
            secondaryColor
          )
        `
          )
          .eq("collectionId", collectionId),
      ]
    );

    if (jobsResponse.error) throw jobsResponse.error;
    if (orgsResponse.error) throw orgsResponse.error;
    if (collectionsResponse.error) throw collectionsResponse.error;

    return {
      jobs: jobsResponse.data?.map((item) => item.job).filter(Boolean) || [],
      organizations:
        orgsResponse.data?.map((item) => item.organization).filter(Boolean) ||
        [],
      collections:
        collectionsResponse.data
          ?.map((item) => item.subCollection)
          .filter(Boolean) || [],
    };
  }

  async searchAll(query: string, searchType: string) {
    const [jobsRes, orgsRes, collectionsRes] = await Promise.all([
      (searchType === "all" || searchType === "jobs") &&
        this.searchAllJobs(query),
      (searchType === "all" || searchType === "organizations") &&
        this.searchAllOrganizations(query),
      (searchType === "all" || searchType === "collections") &&
        this.searchAllCollections(query),
    ]);

    return {
      jobs: jobsRes || [],
      organizations: orgsRes || [],
      collections: collectionsRes || [],
    };
  }

  async searchAllJobs(query: string) {
    return (
      await this.supabase
        .from("jobs")
        .select("*, categories(id, name), organizations!inner(*)")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order("postedAt", { ascending: false })
        .limit(10)
    ).data;
  }
  async searchAllOrganizations(query: string) {
    return (
      await this.supabase
        .from("organizations")
        .select("*")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order("name")
        .limit(10)
    ).data;
  }

  async searchAllCollections(query: string) {
    return (
      await this.supabase
        .from("collections")
        .select("*")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order("name")
        .limit(10)
    ).data;
  }

  async getPageLayoutBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from("page_layouts")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data;
  }

  async getPageContent(layout: any) {
    const jobIds = this.extractIdsFromLayout(layout.structure, "jobs");
    const orgIds = this.extractIdsFromLayout(layout.structure, "organizations");

    const [jobs, organizations] = await Promise.all([
      jobIds.length > 0
        ? this.supabase
            .from("jobs")
            .select("*, categories(id, name), organizations!inner(*)")
            .in("id", jobIds)
        : { data: [] },
      orgIds.length > 0
        ? this.supabase.from("organizations").select("*").in("id", orgIds)
        : { data: [] },
    ]);

    return {
      jobs: jobs.data || [],
      organizations: organizations.data || [],
    };
  }

  async getPageLayoutWithContent(slug: string) {
    const layout = await this.getPageLayoutBySlug(slug);
    const content = await this.getPageContent(layout);
    return { layout, content };
  }

  private extractIdsFromLayout(structure: any[], type: string): string[] {
    const ids = new Set<string>();
    structure.forEach((section) => {
      if (section.type === "list" && section.data.listType === type) {
        section.data.items.forEach((id: string) => ids.add(id));
      }
    });
    return Array.from(ids);
  }

  fetchHomeData() {}
  fetchJobListData() {}
  fetchJobDetailsData() {}
  fetchOrganizationDetailsData() {}
  fetchOrganizationListData() {}
  fetchCollectionDetailsData() {}
  fetchCollectionListData() {}
}
