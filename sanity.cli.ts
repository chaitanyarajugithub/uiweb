import { defineCliConfig } from "sanity/cli";
import { sanitySettings } from "./sanity-config.js";

export default defineCliConfig({
  api: {
    projectId: sanitySettings.projectId,
    dataset: sanitySettings.dataset,
  },
});
