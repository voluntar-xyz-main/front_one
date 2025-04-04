import { config as setupEnv } from "dotenv";
import { JobsProcessor } from "./Runners/JobsProcessor";

setupEnv({
  path: "env/.batch_sync.env",
});

const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_KEY,
  systemUser: process.env.SYSTEM_USER || "",
  yamlBasePath: "./admin/batch_sync/data",
};

const jobs = {
  items: [
    "test_fictive_student_organization",
    "voluntar_xyz",
    "education_ngo",
    "disaster_relief_ngo",
    "human_rights_ngo",
    "healthcare_ngo",
    "arts_culture_ngo",
    "tech_innovation_ngo",
    "cultural_preservation_ngo",
    "career_development_ngo",
    "sports_youth_ngo",
  ],
  layouts: ["home"],
};

async function main() {
  try {
    const jobsProcessor = new JobsProcessor(config);
    const results = await jobsProcessor.runJobs(jobs);

    const failedJobs = results.filter((r) => !r.success);
    if (failedJobs.length > 0) {
      console.error("The following jobs failed:");
      failedJobs.forEach((job) => {
        console.error(`- ${job.type} ${job.name}: ${job.error}`);
      });
      process.exit(1);
    }

    console.log("All jobs completed successfully!");
  } catch (error) {
    console.error("Fatal error during sync:", error);
    process.exit(1);
  }
}

main();
