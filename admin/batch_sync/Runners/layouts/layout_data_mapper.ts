import { PageLayout, PageSection } from "../../types";
import { SupabaseSync } from "../../api_supabase";

export class LayoutDataMapper {
  constructor(private readonly apiSync: SupabaseSync) {}

  async mapForDatabase(layout: PageLayout): Promise<PageLayout> {
    const translatedLayout = await this.translateIds(layout);
    return translatedLayout;
  }

  private async translateIds(layout: PageLayout): Promise<PageLayout> {
    const jobIds = new Set<string>();
    const orgIds = new Set<string>();

    layout.structure?.forEach((section: PageSection) => {
      if (section.type === "list" && section.data && "items" in section.data) {
        section.data.items?.forEach((id: string) => {
          if (section.data.listType === "jobs") {
            jobIds.add(id);
          } else if (section.data.listType === "organizations") {
            orgIds.add(id);
          }
        });
      }
    });

    const [jobMappings, orgMappings] = await Promise.all([
      this.apiSync.fetchJobMappings(Array.from(jobIds)),
      this.apiSync.fetchOrgMappings(Array.from(orgIds)),
    ]);

    const translatedLayout = {
      ...layout,
      structure: layout.structure?.map((section: PageSection) => {
        if (section.type !== "list" || !("items" in section.data)) {
          return section;
        }

        return {
          ...section,
          data: {
            ...section.data,
            items: section.data.items
              .map((id: string) => {
                if (section.data.listType === "jobs") {
                  const uuid = jobMappings.get(id);
                  if (!uuid) {
                    console.warn(`Warning: No UUID found for job ${id}`);
                    return null;
                  }
                  return uuid;
                } else if (section.data.listType === "organizations") {
                  const uuid = orgMappings.get(id);
                  if (!uuid) {
                    console.warn(
                      `Warning: No UUID found for organization ${id}`
                    );
                    return null;
                  }
                  return uuid;
                }
                return id;
              })
              .filter(Boolean),
          },
        };
      }),
    };

    return translatedLayout;
  }
}
