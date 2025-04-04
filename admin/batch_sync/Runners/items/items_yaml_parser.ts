import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";

interface YamlData {
  organizations: any[];
  collections?: any[];
  jobs?: any[];
}

export class ItemsYamlParser {
  async parseFile(filePath: string): Promise<YamlData> {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(`${fullPath}.yml`, "utf8");
    const data = yaml.load(fileContent) as YamlData;

    if (!data?.organizations) {
      throw new Error("Invalid YAML format: organizations array is required");
    }

    return data;
  }
}
