import { SyncPayload, DbOrganization, DbCollection, DbJob } from "../../types";

interface YamlData {
  organizations: any[];
  collections?: any[];
  jobs?: any[];
}

export class ItemsDataMapper {
  private readonly systemUser: string;
  private collectionsMap: Map<string, any> = new Map();
  private jobsMap: Map<string, any> = new Map();
  private warnings: string[] = [];

  constructor(systemUser: string) {
    this.systemUser = systemUser;
  }

  mapForDatabase(parsedData: YamlData, batchId?: string): SyncPayload[] {
    this.warnings = [];
    this.buildReferenceMaps(parsedData);

    const payloads = parsedData.organizations.map((org: any) =>
      this.convertToSyncPayload(org, batchId)
    );

    if (this.warnings.length > 0) {
      console.warn(`Warnings during data mapping:`);
      this.warnings.forEach((warning) => console.warn(warning));
    }

    return payloads;
  }

  private buildReferenceMaps(data: YamlData) {
    this.collectionsMap.clear();
    this.jobsMap.clear();

    if (data.collections) {
      data.collections.forEach((collection: any) => {
        this.collectionsMap.set(collection.external_id, collection);
      });
    }

    if (data.jobs) {
      data.jobs.forEach((job: any) => {
        this.jobsMap.set(job.external_id, job);
      });
    }
  }

  private resolveCollection(collectionRef: string | any): any | null {
    if (typeof collectionRef === "string") {
      const collection = this.collectionsMap.get(collectionRef);
      if (!collection) {
        this.warnings.push(
          `Warning: Referenced collection not found: ${collectionRef}`
        );
        return null;
      }
      return collection;
    }
    return collectionRef;
  }

  private resolveJob(jobRef: string | any): any | null {
    if (typeof jobRef === "string") {
      const job = this.jobsMap.get(jobRef);
      if (!job) {
        this.warnings.push(`Warning: Referenced job not found: ${jobRef}`);
        return null;
      }
      return job;
    }
    return jobRef;
  }

  private convertToSyncPayload(yamlOrg: any, batchId?: string): SyncPayload {
    const organization: DbOrganization = {
      name: yamlOrg.name,
      description: yamlOrg.description,
      slug: yamlOrg.slug,
      websiteUrl: yamlOrg.website,
      logoUrl: yamlOrg.logo_url,
      external_id: yamlOrg.external_id,
      createdBy: this.systemUser,
      batch_id: batchId,
    };

    const collections: DbCollection[] = [];
    const jobs: DbJob[] = [];
    const relationships: any = {
      organizationCollections: [],
      collectionOrganizations: [],
      collectionJobs: [],
    };

    const orgCollections = yamlOrg.collections || [];
    orgCollections.forEach((collectionRef: any) => {
      const yamlCollection = this.resolveCollection(collectionRef);
      if (!yamlCollection) return;

      const collection: DbCollection = {
        name: yamlCollection.name,
        description: yamlCollection.description,
        external_id: yamlCollection.external_id,
        createdBy: this.systemUser,
        batch_id: batchId,
      };
      collections.push(collection);

      relationships.organizationCollections.push({
        organizationId: yamlOrg.external_id,
        collectionId: yamlCollection.external_id,
        group: yamlCollection.group || "default",
      });

      relationships.collectionOrganizations.push({
        collectionId: yamlCollection.external_id,
        organizationId: yamlOrg.external_id,
      });

      const collectionJobs = yamlCollection.jobs || [];
      collectionJobs.forEach((jobRef: any) => {
        const yamlJob = this.resolveJob(jobRef);
        if (!yamlJob) return;

        const job: DbJob = {
          title: yamlJob.title,
          description: yamlJob.description,
          slug: yamlJob.slug,
          skills: yamlJob.skills || [],
          external_id: yamlJob.external_id,
          organizationId: yamlOrg.external_id,
          createdBy: this.systemUser,
          status: "active",
          duration: yamlJob.duration,
          batch_id: batchId,
        };
        jobs.push(job);

        relationships.collectionJobs.push({
          collectionId: yamlCollection.external_id,
          jobId: yamlJob.external_id,
        });
      });
    });

    return {
      organization,
      collections,
      jobs,
      relationships,
      batch_id: batchId || "",
    };
  }
}
