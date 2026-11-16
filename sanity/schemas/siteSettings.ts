import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeading",
      title: "Main headline",
      type: "string",
      description: "Use a new line to split the headline across lines.",
    }),
    defineField({ name: "heroDescription", title: "Main description", type: "text", rows: 3 }),
    defineField({ name: "heroImage", title: "Main image", type: "image", options: { hotspot: true } }),
    defineField({ name: "introHeading", title: "About headline", type: "string" }),
    defineField({ name: "introSubheading", title: "About subheading", type: "string" }),
    defineField({ name: "introDescription", title: "About description", type: "text", rows: 4 }),
    defineField({ name: "approachHeading", title: "Our approach headline", type: "string" }),
    defineField({ name: "approachDescription", title: "Our approach description", type: "text", rows: 4 }),
    defineField({ name: "serviceArea", title: "Service area", type: "string" }),
    defineField({ name: "contactPhone", title: "Business phone", type: "string" }),
    defineField({ name: "contactEmail", title: "Business email", type: "string" }),
    defineField({ name: "footerTagline", title: "Footer tagline", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Website settings" }) },
});
