import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { PageLayout } from "../../types";

export class LayoutYamlParser {
  private readonly systemUser: string;

  constructor(systemUser: string) {
    this.systemUser = systemUser;
  }

  parseFile(filePath: string): PageLayout {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const fileContent = fs.readFileSync(`${fullPath}.yml`, "utf8");
      const data = yaml.load(fileContent) as Partial<PageLayout>;

      if (!data.slug) {
        throw new Error("Invalid YAML format: slug is required");
      }

      const layout = {
        ...data,
        createdBy: this.systemUser,
      } as PageLayout;

      return layout;
    } catch (error) {
      console.error(`Failed to parse layout file: ${error.message}`);
      throw error;
    }
  }
}
