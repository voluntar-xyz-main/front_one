import { ItemsYamlParser } from "./items_yaml_parser";
import { ItemsDataMapper } from "./items_data_mapper";
import { SupabaseSync } from "../../api_supabase";

interface BatchSyncConfig {
  supabaseUrl?: string;
  supabaseKey?: string;
  systemUser: string;
  yamlBasePath?: string;
}

interface SyncResult {
  organizations: number;
  collections: number;
  jobs: number;
  errors: string[];
  batch_id: string;
}

export class BatchSyncItems {
  private yamlParser: ItemsYamlParser;
  private dataMapper: ItemsDataMapper;
  private basePath: string;

  constructor(private config: BatchSyncConfig, private apiSync: SupabaseSync) {
    if (!this.config.systemUser) {
      throw new Error("systemUser is required in configuration");
    }

    this.basePath = this.config.yamlBasePath || "./batch_sync";
    this.yamlParser = new ItemsYamlParser();
    this.dataMapper = new ItemsDataMapper(this.config.systemUser);
  }

  async sync(filePath: string, batch_id: string): Promise<SyncResult> {
    try {
      const rawData = await this.yamlParser.parseFile(filePath);

      const payloads = this.dataMapper.mapForDatabase(rawData, batch_id);

      const results: SyncResult = {
        organizations: 0,
        collections: 0,
        jobs: 0,
        errors: [],
        batch_id,
      };

      for (const payload of payloads) {
        try {
          const syncResult = await this.apiSync.syncOrganizationStructure(
            payload
          );
          results.organizations++;
          results.collections += syncResult.collections.length;
          results.jobs += syncResult.jobs.length;
        } catch (error) {
          results.errors.push(
            `Failed to sync organization ${payload.organization.external_id}: ${error.message}`
          );
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Sync failed: ${error.message}`);
    }
  }

  syncBatch(items: string[]) {
    const itemsPath = `${this.basePath}/items`;
    const promises = items.map(async (item) => {
      try {
        await this.sync(`${itemsPath}/${item}`, item);
        console.log(`Sync completed successfully: ${item}`);
      } catch (error) {
        console.error(`Sync failed for ${item}:`, error);
      }
    });
    return promises;
  }
}
