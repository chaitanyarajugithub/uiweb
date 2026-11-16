import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Service name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "eyebrow", title: "Short label", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", title: "Photo description", type: "string" }),
    defineField({ name: "linkLabel", title: "Link label", type: "string" }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});
