import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
export const bugs = sqliteTable("bugs", {
  id: integer("id").primaryKey(),
  test_rail_project_id: integer("test_rail_project_id").notNull(),
  jira_project_id: text("jira_project_id").notNull(),
  month: text("month", {
    enum: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  }).notNull(),
  year: text("year").notNull(),
  total_bugs: integer("total_bugs").notNull(),
  dev_bugs: integer("dev_bugs").notNull(),
  prod_bugs: integer("prod_bugs").notNull(),
  bug_resolution: real("bug_resolution").notNull(),
  stories_resolved: integer("stories_resolved").notNull(),
  defect_severity_index: real("defect_severity_index").notNull(),
  createdAt: text("createdAt").notNull().default(`datetime("now")`),
  updatedAt: text("updatedAt").notNull().default(`datetime("now")`),
});

export type SelectBugs = typeof bugs.$inferSelect;
export type InsertBugs = typeof bugs.$inferInsert;
