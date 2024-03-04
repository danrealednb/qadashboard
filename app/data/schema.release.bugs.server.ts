import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
export const release_bugs = sqliteTable("release_bugs", {
  id: integer("id").primaryKey(),
  jira_project_id: text("jira_project_id").notNull(),
  release_version: text("release_version").notNull(),
  total_bugs: integer("total_bugs").notNull(),
  dev_bugs: integer("dev_bugs").notNull(),
  prod_bugs: integer("prod_bugs").notNull(),
  bug_resolution: real("bug_resolution").notNull(),
  stories_resolved: integer("stories_resolved").notNull(),
  defect_severity_index: real("defect_severity_index").notNull(),
  createdAt: text("createdAt").notNull().default(`datetime("now")`),
  updatedAt: text("updatedAt").notNull().default(`datetime("now")`),
});

export type SelectBugs = typeof release_bugs.$inferSelect;
export type InsertBugs = typeof release_bugs.$inferInsert;
