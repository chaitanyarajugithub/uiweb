import { defineField, defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Client review",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Review", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "clientName", title: "Client name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "projectDetails", title: "Project type and location", type: "string" }),
    defineField({
      name: "approved",
      title: "Approved to publish",
      type: "boolean",
      description: "Only approved reviews appear on the website.",
      initialValue: false,
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "clientName", subtitle: "quote" },
  },
});
