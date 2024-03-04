import { eq, and } from "drizzle-orm";
import { db } from "~/data/config.server";
import { tests } from "~/data/schema.tests.server";
import { bugs } from "~/data/schema.bugs.server";
import { release_bugs } from "./schema.release.bugs.server";

export const testTypeMappingDB = (testType: string) => {
  switch (testType) {
    case "Total":
      return "total_tests";
    case "Automated":
      return "automated_tests";
    case "Manual":
      return "manual_tests";
    case "Accessibility":
      return "accessibility_tests";
    case "Data Validation":
      return "data_validation_tests";
    case "E2E":
      return "e2e_tests";
    case "Functional":
      return "functional_tests";
    case "Integration":
      return "integration_tests";
    case "Performance":
      return "performance_tests";
    case "Load":
      return "load_tests";
    case "Regression":
      return "regression_tests";
    case "Security":
      return "security_tests";
    case "Smoke":
      return "smoke_tests";
    case "Unit":
      return "unit_tests";
    case "Other":
      return "other_tests";
    case "Non-Functional":
      return "non_functional_tests";
    case null:
      return "NA";
    case undefined:
      return "NA";

    default:
      return "NA";
  }
};

// export const TEST_TYPES = [
//   "Total",
//   "Automated",
//   "Manual",
//   "Accessibility",
//   "Data Validation",
//   "E2E",
//   "Functional",
//   "Integration",
//   "Performance",
//   "Load",
//   "Regression",
//   "Security",
//   "Smoke",
//   "Unit",
//   "Non-Functional",
//   "Other",
// ];

export const years = ["2023", "2024", "2025"];

export async function getBugMetrics(
  testRailProjectId: string,
  jiraProjectId: string,
  year: string
) {
  const metrics = db
    .select()
    .from(bugs)
    .where(
      and(
        eq(bugs.test_rail_project_id, parseInt(testRailProjectId)),
        eq(bugs.jira_project_id, jiraProjectId),
        eq(bugs.year, year)
      )
    )
    .all();
  return metrics;
}

export async function getReleaseBugMetrics(jiraProjectId: string) {
  const metrics = db
    .select()
    .from(release_bugs)
    .where(and(eq(release_bugs.jira_project_id, jiraProjectId)))
    .all();
  return metrics;
}

export async function getTestTypeMetrics(
  testRailProjectId: string,
  jiraProjectId: string,
  year: string
) {
  const metrics = db
    .select()
    .from(tests)
    .where(
      and(
        eq(tests.test_rail_project_id, parseInt(testRailProjectId)),
        eq(tests.jira_project_id, jiraProjectId),
        eq(tests.year, year)
      )
    )
    .all();
  return metrics;
}
