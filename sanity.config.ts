import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanitySettings } from "./sanity-config.js";
import { schemaTypes } from "./sanity/schemas/index";

export default defineConfig({
  name: "default",
  title: "KodandaRamReddy Website",
  projectId: sanitySettings.projectId,
  dataset: sanitySettings.dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website content")
          .items([
            S.listItem()
              .title("Site settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
            S.divider(),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("review").title("Client reviews"),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
