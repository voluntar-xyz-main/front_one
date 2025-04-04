import { SupabaseClient } from "@supabase/supabase-js";
import {
  SyncPayload,
  DbOrganization,
  DbCollection,
  DbJob,
  PageLayout,
} from "./types";

interface SyncResult {
  org: any;
  collections: any[];
  jobs: any[];
}

export class SupabaseSync {
  private currentExternalIds = {
    collections: new Set<string>(),
    jobs: new Set<string>(),
  };

  private existingExternalIds = {
    collections: new Set<string>(),
    jobs: new Set<string>(),
  };

  constructor(private supabase: SupabaseClient) {}

  async syncOrganizationStructure(payload: SyncPayload): Promise<SyncResult> {
    await this.loadExistingIds(payload.batch_id);

    this.currentExternalIds.collections.clear();
    this.currentExternalIds.jobs.clear();

    payload.collections.forEach((c) =>
      this.currentExternalIds.collections.add(c.external_id)
    );
    payload.jobs.forEach((j) =>
      this.currentExternalIds.jobs.add(j.external_id)
    );

    const org = await this.syncOrganization({
      ...payload.organization,
      batch_id: payload.batch_id,
    });

    const collections = await Promise.all(
      payload.collections.map((c) =>
        this.syncCollection({ ...c, batch_id: payload.batch_id })
      )
    );

    const jobs = await Promise.all(
      payload.jobs.map((j) =>
        this.syncJob({
          ...j,
          batch_id: payload.batch_id,
          organizationId: org.id,
        })
      )
    );

    await this.syncRelationships(
      payload.relationships,
      org.id,
      new Map(collections.map((c) => [c.external_id, c.id])),
      new Map(jobs.map((j) => [j.external_id, j.id])),
      payload.batch_id
    );

    await this.deleteRemovedItems(payload.batch_id);

    return { org, collections, jobs };
  }

  async fetchJobMappings(externalIds: string[]): Promise<Map<string, string>> {
    if (externalIds.length === 0) return new Map();

    const { data, error } = await this.supabase
      .from("jobs")
      .select("id, external_id")
      .in("external_id", externalIds);

    if (error) throw error;

    return new Map(data.map((job) => [job.external_id, job.id]));
  }

  async fetchOrgMappings(externalIds: string[]): Promise<Map<string, string>> {
    if (externalIds.length === 0) return new Map();

    const { data, error } = await this.supabase
      .from("organizations")
      .select("id, external_id")
      .in("external_id", externalIds);

    if (error) throw error;

    return new Map(data.map((org) => [org.external_id, org.id]));
  }

  async upsertLayout(layout: PageLayout): Promise<void> {
    const { error } = await this.supabase.from("page_layouts").upsert(
      {
        name: layout.name,
        slug: layout.slug,
        structure: layout.structure,
        createdBy: layout.createdBy,
      },
      { onConflict: "slug" }
    );

    if (error) throw error;
  }

  private async loadExistingIds(batchId: string) {
    const { data: existingCollections } = await this.supabase
      .from("collections")
      .select("external_id")
      .eq("batch_id", batchId);

    const { data: existingJobs } = await this.supabase
      .from("jobs")
      .select("external_id")
      .eq("batch_id", batchId);

    this.existingExternalIds.collections = new Set(
      existingCollections?.map((c) => c.external_id) || []
    );
    this.existingExternalIds.jobs = new Set(
      existingJobs?.map((j) => j.external_id) || []
    );
  }

  private async deleteRemovedItems(batchId: string) {
    const collectionsToDelete = Array.from(
      this.existingExternalIds.collections
    ).filter((id) => !this.currentExternalIds.collections.has(id));

    const jobsToDelete = Array.from(this.existingExternalIds.jobs).filter(
      (id) => !this.currentExternalIds.jobs.has(id)
    );

    if (jobsToDelete.length > 0) {
      console.log("Deleting jobs:", jobsToDelete);
      const { error: jobsError } = await this.supabase
        .from("jobs")
        .delete()
        .eq("batch_id", batchId)
        .in("external_id", jobsToDelete);

      if (jobsError) throw jobsError;
    }

    if (collectionsToDelete.length > 0) {
      console.log("Deleting collections:", collectionsToDelete);
      const { error: collectionsError } = await this.supabase
        .from("collections")
        .delete()
        .eq("batch_id", batchId)
        .in("external_id", collectionsToDelete);

      if (collectionsError) throw collectionsError;
    }
  }

  private async syncOrganization(org: DbOrganization) {
    const { data: existing } = await this.supabase
      .from("organizations")
      .select()
      .eq("external_id", org.external_id)
      .single();

    const orgData = {
      name: org.name,
      description: org.description,
      slug: org.slug,
      websiteUrl: org.websiteUrl,
      logoUrl: org.logoUrl,
      external_id: org.external_id,
      createdBy: org.createdBy,
      batch_id: org.batch_id,
    };

    if (existing) {
      console.log("Updating organization:", org.external_id);
      const { data, error } = await this.supabase
        .from("organizations")
        .update(orgData)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating organization:", error);
        throw error;
      }
      return { ...data, external_id: org.external_id };
    }

    console.log("Creating new organization:", org.external_id);
    const { data, error } = await this.supabase
      .from("organizations")
      .insert(orgData)
      .select()
      .single();

    if (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
    return { ...data, external_id: org.external_id };
  }

  private async syncCollection(collection: DbCollection) {
    const { data: existing } = await this.supabase
      .from("collections")
      .select()
      .eq("external_id", collection.external_id)
      .single();

    const collectionData = {
      name: collection.name,
      description: collection.description,
      external_id: collection.external_id,
      createdBy: collection.createdBy,
      batch_id: collection.batch_id,
    };

    if (existing) {
      console.log("Updating collection:", collection.external_id);
      const { data, error } = await this.supabase
        .from("collections")
        .update(collectionData)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating collection:", error);
        throw error;
      }
      return { ...data, external_id: collection.external_id };
    }

    console.log("Creating new collection:", collection.external_id);
    const { data, error } = await this.supabase
      .from("collections")
      .insert(collectionData)
      .select()
      .single();

    if (error) {
      console.error("Error creating collection:", error);
      throw error;
    }
    return { ...data, external_id: collection.external_id };
  }

  private async syncJob(job: DbJob) {
    const { data: existing } = await this.supabase
      .from("jobs")
      .select()
      .eq("external_id", job.external_id)
      .single();

    const jobData = {
      title: job.title,
      description: job.description,
      slug: job.slug,
      skills: job.skills,
      external_id: job.external_id,
      organizationId: job.organizationId,
      status: job.status,
      createdBy: job.createdBy,
      batch_id: job.batch_id,
      duration: job.duration || "",
    };

    if (existing) {
      console.log("Updating job:", job.external_id);
      const { data, error } = await this.supabase
        .from("jobs")
        .update(jobData)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating job:", error);
        throw error;
      }
      return { ...data, external_id: job.external_id };
    }

    console.log("Creating new job:", job.external_id);
    const { data, error } = await this.supabase
      .from("jobs")
      .insert(jobData)
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error);
      throw error;
    }
    return { ...data, external_id: job.external_id };
  }

  private async syncRelationships(
    relationships: SyncPayload["relationships"],
    orgId: string,
    collectionMap: Map<string, string>,
    jobMap: Map<string, string>,
    batch_id: string
  ) {
    await Promise.all(
      relationships.organizationCollections.map(async (rel) => {
        const collectionId = collectionMap.get(rel.collectionId);
        if (!collectionId) return;

        await this.ensureOrganizationCollection(
          orgId,
          collectionId,
          rel.group,
          batch_id
        );
      })
    );

    await Promise.all(
      relationships.collectionOrganizations.map(async (rel) => {
        const collectionId = collectionMap.get(rel.collectionId);
        if (!collectionId) return;

        await this.ensureCollectionOrganization(collectionId, orgId, batch_id);
      })
    );

    await Promise.all(
      relationships.collectionJobs.map(async (rel) => {
        const collectionId = collectionMap.get(rel.collectionId);
        const jobId = jobMap.get(rel.jobId);
        if (!collectionId || !jobId) return;

        await this.ensureCollectionJob(collectionId, jobId, batch_id);
      })
    );
  }

  private async ensureOrganizationCollection(
    organizationId: string,
    collectionId: string,
    group: string,
    batch_id: string
  ) {
    const { data: existing } = await this.supabase
      .from("organization_collections")
      .select()
      .match({ organizationId, collectionId })
      .single();

    if (existing) {
      await this.supabase
        .from("organization_collections")
        .update({ batch_id, group })
        .match({ organizationId, collectionId });
    } else {
      await this.supabase.from("organization_collections").insert({
        organizationId,
        collectionId,
        group,
        order: 0,
        batch_id,
      });
    }
  }

  private async ensureCollectionOrganization(
    collectionId: string,
    organizationId: string,
    batch_id: string
  ) {
    const { data: existing } = await this.supabase
      .from("collection_organizations")
      .select()
      .match({ collectionId, organizationId })
      .single();

    if (existing) {
      await this.supabase
        .from("collection_organizations")
        .update({ batch_id })
        .match({ collectionId, organizationId });
    } else {
      await this.supabase
        .from("collection_organizations")
        .insert({ collectionId, organizationId, batch_id });
    }
  }

  private async ensureCollectionJob(
    collectionId: string,
    jobId: string,
    batch_id: string
  ) {
    const { data: existing } = await this.supabase
      .from("collection_jobs")
      .select()
      .match({ collectionId, jobId })
      .single();

    if (existing) {
      await this.supabase
        .from("collection_jobs")
        .update({ batch_id })
        .match({ collectionId, jobId });
    } else {
      await this.supabase
        .from("collection_jobs")
        .insert({ collectionId, jobId, batch_id });
    }
  }
}
