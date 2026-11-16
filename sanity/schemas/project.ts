import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Project name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "status",
      title: "Project status",
      type: "string",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "Ongoing", value: "ongoing" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "category", title: "Project type", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "currentStage", title: "Current stage (ongoing projects)", type: "string" }),
    defineField({ name: "image", title: "Project photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", title: "Photo description", type: "string" }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "title", subtitle: "status", media: "image" },
  },
});
