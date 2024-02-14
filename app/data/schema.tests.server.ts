import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const tests = sqliteTable("tests", {
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
  total_tests: integer("total_tests").notNull(),
  automated_tests: integer("automated_tests").notNull(),
  manual_tests: integer("manual_tests").notNull(),
  accessibility_tests: integer("accessibility_tests").notNull(),
  data_validation_tests: integer("data_validation_tests").notNull(),
  e2e_tests: integer("e2e_tests").notNull(),
  functional_tests: integer("functional_tests").notNull(),
  integration_tests: integer("integration_tests").notNull(),
  performance_tests: integer("performance_tests").notNull(),
  load_tests: integer("load_tests").notNull(),
  regression_tests: integer("regression_tests").notNull(),
  security_tests: integer("security_tests").notNull(),
  smoke_tests: integer("smoke_tests").notNull(),
  unit_tests: integer("unit_tests").notNull(),
  non_functional_tests: integer("non_functional_tests").notNull(),
  other_tests: integer("other_tests").notNull(),
  createdAt: text("createdAt").notNull().default(`datetime("now")`),
  updatedAt: text("updatedAt").notNull().default(`datetime("now")`),
});

export type SelectTests = typeof tests.$inferSelect;
export type InsertTests = typeof tests.$inferInsert;
