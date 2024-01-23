import { db } from "~/data/config.server";
import { InsertTests, tests } from "~/data/schema.tests.server";

const record: InsertTests = {
  month: "Jan",
  year: "2023",
  total_tests: 125,
  automated_tests: 0,
  manual_tests: 0,
  accessibility_tests: 0,
  data_validation_tests: 0,
  e2e_tests: 0,
  functional_tests: 0,
  integration_tests: 0,
  performance_tests: 0,
  load_tests: 0,
  regression_tests: 0,
  security_tests: 0,
  smoke_tests: 0,
  unit_tests: 0,
  non_functional_tests: 0,
  other_tests: 0,
};

async function main() {
  await db.insert(tests).values(record).run();

  const metrics = await db.select().from(tests).all();
  console.log("Metrics", metrics);
}

main();
