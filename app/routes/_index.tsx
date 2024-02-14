import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  Await,
  Link,
  Form,
  useSearchParams,
} from "@remix-run/react";
import CountVisualWithLink from "~/components/ChartVisualWithLink";
import CountVisual from "~/components/CountVisual";
import CountVisualWithTooltip from "~/components/CountVisualWithToolTip";

import Header from "~/components/Header";
import PercentageVisual from "~/components/PercentageVisual";

import StarbasePieChart from "~/components/StarbasePieChart";

import {
  getDefectDensity,
  getDefectSeverityIndex,
  getJiraBugs30Days,
  getJiraBugs30DaysDev,
  getJiraBugs30DaysProd,
  getJiraDefectResolutionTime,
  getJiraProjects,
  getJiraStories30Days,
  getResolvedJiraBugs30Days,
  getTestCaseEffectiveness,
} from "~/data/jira.server";
import {
  getCurrentTestRuns,
  getTestRailProjects,
  getTotalTestsExecuted,
  TEST_RUN_DATA,
} from "~/data/testrail.server";

import { Suspense } from "react";
import { defer } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "QA Dashboard" },
    { name: "description", content: "Starbase QA Metrics Dashboard" },
  ];
};

export default function Index() {
  const {
    testRuns,
    jiraDefects30Days,
    jiraDefects30DaysProd,
    jiraDefects30DaysDev,
    testCaseEffectiveness,
    jiraStories30Days,
    defectDensity,
    defectResolutionTime,
    defectseverityindex,
    jiraProjects,
    testRailProjects,
  } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();

  return (
    <>
      <Header testRailProjectId={params.get("testRailProject") || "4"} />

      <div className="flex justify-center items-center text-center pt-2">
        <Form className="grid space-y-2">
          <label htmlFor="" className="font-bold">
            Jira Project
          </label>
          <Suspense fallback={<p>Loading Jira Projects.......</p>}>
            <Await resolve={jiraProjects}>
              {(jiraProjects) => (
                <select
                  name="jiraProject"
                  id="jiraProject"
                  data-testid="jiraProject"
                  className="border-blue-600 border-2 rounded-full px-2 py-1"
                  defaultValue={params.get("jiraProject") || "PLAT"}
                >
                  {jiraProjects.map((project: any) => (
                    <option key={project.id} value={project.key}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
            </Await>
          </Suspense>

          <label htmlFor="" className="font-bold">
            Test Rail Project
          </label>
          <Suspense fallback={<p>Loading Test Rail Projects.......</p>}>
            <Await resolve={testRailProjects}>
              {(testRailProjects) => (
                <select
                  name="testRailProject"
                  id="testRailProject"
                  data-testid="testRailProject"
                  className="border-green-700 border-2 rounded-full px-2 py-1"
                  defaultValue={params.get("testRailProject") || "4"}
                >
                  {testRailProjects.projects.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
            </Await>
          </Suspense>

          <div className="py-5">
            <button className="border-4 border-red-600 rounded-full px-2 py-1">
              Load Metrics
            </button>
          </div>
        </Form>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={testRuns}>
            {(testRuns) => (
              <>
                {testRuns.map((run: TEST_RUN_DATA) => (
                  <StarbasePieChart
                    chartName={run.name!!}
                    passed={run.passed}
                    failed={run.failed}
                    blocked={run.blocked}
                    retest={run.retest}
                    untested={run.untested}
                    testRunId={run.id}
                    projectId={params.get("testRailProject") || "4"}
                  />
                ))}
              </>
            )}
          </Await>
        </Suspense>
      </div>
      <div className="grid grid-cols-5">
        <div className="grid justify-center text-center space-y-2">
          <label htmlFor="" className="text-xl font-bold">
            <Link to="/featurecoverage">Feature Test Coverage</Link>
          </label>
          <label htmlFor="" className="text-blue-700 font-bold">
            <Link to="/featurecoverage">Click to learn more</Link>
          </label>
        </div>

        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={defectDensity}>
            {(defectDensity) => (
              <CountVisualWithTooltip
                chartName="Defect Density"
                count={parseFloat(defectDensity)}
                tooltip="Number of defects divided by number of stories"
              />
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={defectResolutionTime}>
            {(defectResolutionTime) => (
              <CountVisualWithTooltip
                chartName="Defect Resolution Time (Days)"
                count={parseFloat(defectResolutionTime.toFixed(2)) || 0}
                tooltip="Defect closure date minus defect creation date. Average number of days taken to fix bugs"
              />
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={testCaseEffectiveness}>
            {(testCaseEffectiveness) => (
              <CountVisualWithTooltip
                chartName="Test Case Effectiveness"
                count={parseFloat(testCaseEffectiveness)}
                tooltip="Number of defects found divided by number of test cases executed"
              />
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={jiraStories30Days}>
            {(jiraStories30Days) => (
              <CountVisualWithLink
                chartName="Total Stories Completed"
                count={jiraStories30Days.totalJiraIssues}
                page="/stories"
              />
            )}
          </Await>
        </Suspense>
      </div>

      <div className="grid grid-cols-4 py-20">
        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={jiraDefects30Days}>
            {(jiraDefects30Days) => (
              <CountVisualWithLink
                chartName="Defects (30 Days)"
                count={jiraDefects30Days.totalJiraIssues}
                page="/defects30all"
              />
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={jiraDefects30DaysProd}>
            {(jiraDefects30DaysProd) => (
              <CountVisualWithLink
                chartName="Defects Prod (30 Days) (Defect Leakage)"
                count={jiraDefects30DaysProd.totalJiraIssues}
                page="/defects30prod"
              />
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={jiraDefects30DaysDev}>
            {(jiraDefects30DaysDev) => (
              <CountVisualWithLink
                chartName="Defects Dev (30 Days)"
                count={jiraDefects30DaysDev.totalJiraIssues}
                page="/defects30dev"
              />
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={defectseverityindex}>
            {(defectseverityindex) => (
              <CountVisualWithLink
                chartName="Defect Severity Index"
                count={parseFloat(defectseverityindex)}
                page="/defectseverityindex"
              />
            )}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);

  const testRailProjects = getTestRailProjects();

  const selectedTestRailProject = search.get("testRailProject") || "4";

  const jiraProjects = getJiraProjects();

  const selectedJiraProject = search.get("jiraProject") || "PLAT";

  const testRuns = getCurrentTestRuns(selectedTestRailProject);

  const totalTestsExecuted = getTotalTestsExecuted(testRuns);

  const jiraDefects30Days = getJiraBugs30Days(selectedJiraProject);
  const jiraDefects30DaysProd = getJiraBugs30DaysProd(selectedJiraProject);
  const jiraDefects30DaysDev = getJiraBugs30DaysDev(selectedJiraProject);
  const jiraStories30Days = getJiraStories30Days(selectedJiraProject);

  const jiraDefectsResolved30Days =
    getResolvedJiraBugs30Days(selectedJiraProject);

  const testCaseEffectiveness = getTestCaseEffectiveness(
    jiraDefects30Days,
    totalTestsExecuted
  );

  const defectDensity = getDefectDensity(jiraDefects30Days, jiraStories30Days);

  const defectResolutionTime = getJiraDefectResolutionTime(
    jiraDefectsResolved30Days
  );

  const defectseverityindex = getDefectSeverityIndex(jiraDefects30Days);

  return defer({
    testRuns,
    jiraDefects30Days,
    jiraDefects30DaysProd,
    jiraDefects30DaysDev,
    testCaseEffectiveness,
    jiraStories30Days,
    defectDensity,
    defectResolutionTime,
    defectseverityindex,
    jiraProjects,
    testRailProjects,
  });
}
