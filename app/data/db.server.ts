import { getXataClient } from "src/xata";

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

export const TEST_TYPES = [
  "Total",
  "Automated",
  "Manual",
  "Accessibility",
  "Data Validation",
  "E2E",
  "Functional",
  "Integration",
  "Performance",
  "Load",
  "Regression",
  "Security",
  "Smoke",
  "Unit",
  "Non-Functional",
  "Other",
];

export const years = ["2023", "2024"];

export async function getMetrics(year: string) {
  const metrics = await getXataClient().db.bugs.filter({ year }).getAll();
  return metrics;
}

export async function getTestTypeMetrics(year: string) {
  const metrics = await getXataClient().db.test_types.filter({ year }).getAll();
  return metrics;
}