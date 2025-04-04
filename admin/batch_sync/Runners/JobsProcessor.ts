import { createClient } from "@supabase/supabase-js";
import { SupabaseSync } from "./api_supabase";
import { BatchSyncItems } from "./Runners/items/items_batch_sync";
import { BatchSyncLayouts } from "./Runners/layouts/layout_batch_sync";

interface JobResult {
  type: string;
  name: string;
  success: boolean;
  error?: string;
  details?: any;
}
export class JobsProcessor {
  private apiSync: SupabaseSync;
  private itemsSync: BatchSyncItems;
  private layoutsSync: BatchSyncLayouts;

  constructor(private config: any) {
    this.setup();
  }

  setup(): void {
    if (
      !this.config.supabaseUrl ||
      !this.config.supabaseKey ||
      !this.config.systemUser
    ) {
      throw new Error(
        "VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY, and SYSTEM_USER are required"
      );
    }

    const supabase = createClient(
      this.config.supabaseUrl,
      this.config.supabaseKey
    );
    this.apiSync = new SupabaseSync(supabase);

    this.itemsSync = new BatchSyncItems(this.config, this.apiSync);
    this.layoutsSync = new BatchSyncLayouts(this.config, this.apiSync);
  }

  async runJobs(jobs: {
    items: string[];
    layouts: string[];
  }): Promise<JobResult[]> {
    console.log("Starting batch synchronization...");

    const results: JobResult[] = [];

    if (jobs.items && jobs.items.length > 0) {
      const itemResults = await this.runItemsJobs(jobs.items);
      results.push(...itemResults);
    }

    if (jobs.layouts && jobs.layouts.length > 0) {
      const layoutResults = await this.runLayoutsJobs(jobs.layouts);
      results.push(...layoutResults);
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.length - successful;

    console.log(`Sync completed: ${successful} successful, ${failed} failed`);

    return results;
  }

  async runItemsJobs(items: string[]): Promise<JobResult[]> {
    console.log(`Processing ${items.length} item jobs...`);

    const results: JobResult[] = [];

    for (const item of items) {
      try {
        console.log(`Starting item sync: ${item}`);
        const syncResult = await this.itemsSync.sync(
          `${this.config.yamlBasePath}/items/${item}`,
          item
        );

        results.push({
          type: "item",
          name: item,
          success: true,
          details: {
            organizations: syncResult.organizations,
            collections: syncResult.collections,
            jobs: syncResult.jobs,
          },
        });

        console.log(`Item sync completed: ${item}`);
      } catch (error) {
        console.error(`Failed to sync item ${item}:`, error);

        results.push({
          type: "item",
          name: item,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  async runLayoutsJobs(layouts: string[]): Promise<JobResult[]> {
    console.log(`Processing ${layouts.length} layout jobs...`);

    const results: JobResult[] = [];

    for (const layout of layouts) {
      try {
        console.log(`Starting layout sync: ${layout}`);
        await this.layoutsSync.syncLayout(
          `${this.config.yamlBasePath}/page_layouts/${layout}`
        );

        results.push({
          type: "layout",
          name: layout,
          success: true,
        });

        console.log(`Layout sync completed: ${layout}`);
      } catch (error) {
        console.error(`Failed to sync layout ${layout}:`, error);

        results.push({
          type: "layout",
          name: layout,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }
}
