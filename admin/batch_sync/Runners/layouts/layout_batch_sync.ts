import { LayoutYamlParser } from "./layout_yaml_parser";
import { LayoutDataMapper } from "./layout_data_mapper";
import { SupabaseSync } from "../../api_supabase";

interface BatchLayoutConfig {
  supabaseUrl?: string;
  supabaseKey?: string;
  systemUser: string;
  yamlBasePath?: string;
}

export class BatchSyncLayouts {
  private readonly layoutYamlParser: LayoutYamlParser;
  private readonly layoutDataMapper: LayoutDataMapper;
  private readonly basePath: string;

  constructor(
    private config: BatchLayoutConfig,
    private apiSync: SupabaseSync
  ) {
    if (!this.config.systemUser) {
      throw new Error("systemUser is required in configuration");
    }

    this.basePath = this.config.yamlBasePath || "./batch_sync";
    this.layoutYamlParser = new LayoutYamlParser(this.config.systemUser);
    this.layoutDataMapper = new LayoutDataMapper(apiSync);
  }

  async syncLayout(filePath: string): Promise<void> {
    try {
      const layout = this.layoutYamlParser.parseFile(filePath);

      const translatedLayout = await this.layoutDataMapper.mapForDatabase(
        layout
      );

      await this.apiSync.upsertLayout(translatedLayout);

      console.log(`Synced layout: ${translatedLayout.slug}`);
    } catch (error) {
      console.error(`Failed to sync layout: ${error.message}`);
      throw error;
    }
  }

  syncBatch(layouts: string[]) {
    const layoutsPath = `${this.basePath}/page_layouts`;
    const promises = layouts.map(async (layout) => {
      try {
        await this.syncLayout(`${layoutsPath}/${layout}`);
        console.log(`Synced layout: ${layout}`);
      } catch (error) {
        console.error(`Failed to sync layout ${layout}:`, error);
      }
    });

    return promises;
  }
}
