import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { DateTime } from "luxon";
import Header from "~/components/Header";
import { db } from "~/data/config.server";
import { eq, and } from "drizzle-orm";
import {
  getDefectResolutionTime,
  getDefectSeverityIndexMonthly,
  getJiraBugs30Days,
  getJiraBugs30DaysDev,
  getJiraBugs30DaysProd,
  getJiraProjects,
  getJiraStories30Days,
  getResolvedJiraBugs30Days,
} from "~/data/jira.server";
import { InsertBugs, SelectBugs, bugs } from "~/data/schema.bugs.server";
import { InsertTests, SelectTests, tests } from "~/data/schema.tests.server";
import {
  getAutomatedTests,
  getManualTests,
  getTestCasesFromTestRail,
  getTestRailProjects,
  getTestTypeTests,
} from "~/data/testrail.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const testRailProjectId = params.trId;
  const jiraProjectId = params.jId;
  const formData = await request.formData();
  const vals = Object.fromEntries(formData);
  console.log(vals);

  await addTestData(
    jiraProjectId,
    testRailProjectId,
    vals.month.toString(),
    vals.year.toString()
  );
  await addBugData(
    jiraProjectId,
    testRailProjectId,
    vals.month.toString(),
    vals.year.toString()
  );
  return redirect(`/dashboard/tr/${testRailProjectId}/j/${jiraProjectId}`);
}
export async function loader({ request, params }: LoaderFunctionArgs) {
  const testRailProjectId = params.trId;
  const jiraProjectId = params.jId;
  // use drizzle to get the data
  const testData = db
    .select()
    .from(tests)
    .where(
      and(
        eq(tests.test_rail_project_id, parseInt(testRailProjectId)),
        eq(tests.jira_project_id, jiraProjectId)
      )
    )
    .all();
  const bugData = db
    .select()
    .from(bugs)
    .where(
      and(
        eq(bugs.test_rail_project_id, parseInt(testRailProjectId)),
        eq(bugs.jira_project_id, jiraProjectId)
      )
    )
    .all();

  const testRailProjects = await getTestRailProjects();

  const jiraProjects = await getJiraProjects();

  const jiraProject = jiraProjects.filter((jp: any) => jp.key === params.jId);
  const testRailProject = testRailProjects.projects.filter(
    (project: any) => project.id === parseInt(params.trId)
  );

  return { testData, bugData, jiraProject, testRailProject };
}
async function addBugData(
  jiraProjectId: string,
  testRailProjectId: string,
  month: string,
  year: string
) {
  const jiraDefects30Days = await getJiraBugs30Days(jiraProjectId);
  const jiraDefects30DaysProd = await getJiraBugs30DaysProd(jiraProjectId);
  const jiraDefects30DaysDev = await getJiraBugs30DaysDev(jiraProjectId);
  const jiraStories30Days = await getJiraStories30Days(jiraProjectId);

  const jiraDefectsResolved30Days = await getResolvedJiraBugs30Days(
    jiraProjectId
  );
  const defectResolutionTime = await getDefectResolutionTime(
    jiraDefectsResolved30Days.jiraData
  );

  const defectSeverityIndex = await getDefectSeverityIndexMonthly(
    jiraDefects30Days
  );

  const record: InsertBugs = {
    test_rail_project_id: parseInt(testRailProjectId),
    jira_project_id: jiraProjectId,
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

async function addTestData(
  jiraProjectId: string,
  testRailProjectId: string,
  month: string,
  year: string
) {
  const testCaseData = await getTestCasesFromTestRail(testRailProjectId, 0);

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
    test_rail_project_id: parseInt(testRailProjectId),
    jira_project_id: jiraProjectId,
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
  const { testData, bugData, jiraProject, testRailProject } =
    useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const actionState =
    navigation.state === "submitting"
      ? "Adding Monthly Data..."
      : navigation.state === "loading"
      ? "Loading Data...!"
      : "";
  const params = useParams();
  return (
    <>
      <Header testRailProjectId={params.trId} jiraProjectId={params.jId} />
      <Form method="POST" className="pt-10">
        <div className="grid justify-center space-y-5">
          {/* <div className="grid">
            <label htmlFor="" className="font-bold text-center">
              Jira Project
            </label>
            <select
              name="jira_project_id"
              id="jira_project_id"
              data-testid="jira_project_id"
              className="border-blue-600 border-2 rounded-full px-2 py-1"
              defaultValue={params.jId}
            >
              {jiraProjects.map((project: any) => (
                <option key={project.id} value={project.key}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid">
            <label htmlFor="" className="font-bold text-center">
              Test Rail Project
            </label>
            <select
              name="test_rail_project_id"
              id="test_rail_project_id"
              data-testid="test_rail_project_id"
              className="border-green-700 border-2 rounded-full px-2 py-1"
              defaultValue={params.trId}
            >
              {testRailProjects.projects.map((project: any) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="grid">
            <label htmlFor="" className="font-bold text-center">
              Select Month
            </label>
            <select
              name="month"
              id="month"
              className="border-2 border-blue-600 rounded"
              defaultValue={DateTime.now().monthShort}
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
          </div>

          <div className="grid">
            <label htmlFor="" className="font-bold text-center">
              Select Year
            </label>
            <select
              name="year"
              id="year"
              className="border-2 border-blue-600 rounded"
              defaultValue={DateTime.now().year}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <label htmlFor="">
            Test Rail Project: {testRailProject[0].name}{" "}
            {`(${testRailProject[0].id})`}
          </label>
          <input
            type="hidden"
            name="test_rail_project_id"
            value={params.trId}
            disabled
          />
          <label htmlFor="">
            JIRA Project: {jiraProject[0].name} {`(${jiraProject[0].key})`}
          </label>
          <input
            type="hidden"
            name="jira_project_id"
            value={params.jId}
            disabled
          />

          <div className="flex justify-center py-5">
            <button
              type="submit"
              value="Submit"
              className="rounded-full border-4 border-red-600 px-4"
            >
              Add Monthly Data{" "}
            </button>
          </div>
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
