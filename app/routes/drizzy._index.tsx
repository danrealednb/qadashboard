import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { db } from "~/data/config.server";
import {
  getDefectResolutionTime,
  getDefectSeverityIndexMonthly,
  getJiraBugs30Days,
  getJiraBugs30DaysDev,
  getJiraBugs30DaysProd,
  getJiraStories30Days,
  getResolvedJiraBugs30Days,
} from "~/data/jira.server";
import { InsertBugs, SelectBugs, bugs } from "~/data/schema.bugs.server";
import { InsertTests, SelectTests, tests } from "~/data/schema.tests.server";
import {
  getAutomatedTests,
  getManualTests,
  getTestCasesFromTestRail,
  getTestTypeTests,
} from "~/data/testrail.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const vals = Object.fromEntries(formData);

  await addTestData(vals.month.toString(), vals.year.toString());
  await addtBugData(vals.month.toString(), vals.year.toString());
  return {
    success: true,
  };
}
export async function loader({ request }: LoaderFunctionArgs) {
  // use drizzle to get the data
  const testData = db.select().from(tests).all();
  const bugData = db.select().from(bugs).all();
  return { testData, bugData };
}
async function addtBugData(month: string, year: string) {
  const jiraDefects30Days = await getJiraBugs30Days();
  const jiraDefects30DaysProd = await getJiraBugs30DaysProd();
  const jiraDefects30DaysDev = await getJiraBugs30DaysDev();
  const jiraStories30Days = await getJiraStories30Days();

  const jiraDefectsResolved30Days = await getResolvedJiraBugs30Days();
  const defectResolutionTime = await getDefectResolutionTime(
    jiraDefectsResolved30Days.jiraData
  );

  const defectSeverityIndex = await getDefectSeverityIndexMonthly(
    jiraDefects30Days
  );

  const record: InsertBugs = {
    month: month as InsertBugs["month"],
    year,
    total_bugs: jiraDefects30Days.totalJiraIssues,
    dev_bugs: jiraDefects30DaysDev.totalJiraIssues,
    prod_bugs: jiraDefects30DaysProd.totalJiraIssues,
    bug_resolution: defectResolutionTime,
    stories_resolved: jiraStories30Days.totalJiraIssues,
    defect_severity_index: parseFloat(defectSeverityIndex),
  };
  const recordId = db.insert(bugs).values(record).run().lastInsertRowid;
  console.log("Inserted Bug Record Id", recordId);
}

async function addTestData(month: string, year: string) {
  const testCaseData = await getTestCasesFromTestRail(0);

  const totalTestCases = testCaseData.length;

  const automatedTests = getAutomatedTests(testCaseData);

  const manualTests = getManualTests(testCaseData);

  const accessibilityTests = getTestTypeTests(testCaseData, 1);

  const dataValidationTests = getTestTypeTests(testCaseData, 2);

  const e2eTests = getTestTypeTests(testCaseData, 3);

  const functionalTests = getTestTypeTests(testCaseData, 4);

  const integrationTests = getTestTypeTests(testCaseData, 5);

  const performanceTests = getTestTypeTests(testCaseData, 6);

  const loadTests = getTestTypeTests(testCaseData, 7);

  const regressionTests = getTestTypeTests(testCaseData, 8);

  const securityTests = getTestTypeTests(testCaseData, 9);

  const smokeTests = getTestTypeTests(testCaseData, 10);

  const unitTests = getTestTypeTests(testCaseData, 11);

  const nonFunctionalTests = getTestTypeTests(testCaseData, 12);
  const otherTests = getTestTypeTests(testCaseData, 13);

  const record: InsertTests = {
    month: month as InsertTests["month"],
    year: year,
    total_tests: totalTestCases,
    automated_tests: automatedTests.length,
    manual_tests: manualTests.length,
    accessibility_tests: accessibilityTests.length,
    data_validation_tests: dataValidationTests.length,
    e2e_tests: e2eTests.length,
    functional_tests: functionalTests.length,
    integration_tests: integrationTests.length,
    performance_tests: performanceTests.length,
    load_tests: loadTests.length,
    regression_tests: regressionTests.length,
    security_tests: securityTests.length,
    smoke_tests: smokeTests.length,
    unit_tests: unitTests.length,
    non_functional_tests: nonFunctionalTests.length,
    other_tests: otherTests.length,
  };

  const recordId = db.insert(tests).values(record).run().lastInsertRowid;
  console.log("Inserted Tests Record Id", recordId);
}

export default function Index() {
  const { testData, bugData } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const actionState =
    navigation.state === "submitting"
      ? "Adding Monthly Data..."
      : navigation.state === "loading"
      ? "Loading Data...!"
      : "";
  return (
    <>
      <Form method="POST" className="pt-10">
        <div className="grid justify-center space-y-2">
          <select
            name="month"
            id="month"
            className="border-2 border-blue-600 rounded"
          >
            <option value="Jan">Jan</option>
            <option value="Feb">Feb</option>
            <option value="Mar">Mar</option>
            <option value="Apr">Apr</option>
            <option value="May">May</option>
            <option value="Jun">Jun</option>
            <option value="Jul">Jul</option>
            <option value="Aug">Aug</option>
            <option value="Sep">Sep</option>
            <option value="Oct">Oct</option>
            <option value="Nov">Nov</option>
            <option value="Dev">Dev</option>
          </select>

          <select
            name="year"
            id="year"
            className="border-2 border-blue-600 rounded"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>

          <button
            type="submit"
            value="Submit"
            className="rounded-full border-4 border-red-600 px-4"
          >
            Add Monthly Data{" "}
          </button>
        </div>
      </Form>

      <label className="flex justify-center text-blue-600 font-extrabold py-2">
        {actionState}
      </label>

      <h1 className="flex justify-center py-5">Tests</h1>
      <div className="flex justify-center">
        <ul className="grid justify-center py-2">
          {testData.map((d: SelectTests) => (
            <li key={d.id}>
              {d.month} {d.year} {d.total_tests}
            </li>
          ))}
        </ul>
      </div>
      <h1 className="flex justify-center py-5">Bugs</h1>
      <div className="flex justify-center">
        <ul className="grid justify-center py-2">
          {bugData.map((d: SelectBugs) => (
            <li key={d.id}>
              {d.month} {d.year} {d.total_bugs}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
