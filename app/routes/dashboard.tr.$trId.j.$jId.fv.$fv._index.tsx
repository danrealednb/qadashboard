import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  Await,
  Link,
  Form,
  useSearchParams,
  useParams,
  useNavigation,
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
  getJiraBugsOpened,
  getJiraDefectResolutionTime,
  getJiraFixVersions,
  getJiraProjects,
  getJiraStories30Days,
  getResolvedJiraBugs30Days,
  getTestCaseEffectiveness,
} from "~/data/jira.server";
import {
  getCurrentTestRuns,
  getReleaseTestRuns,
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
    jiraDefectsOpen,
    jiraDefects30DaysFV,
    jiraDefects30DaysProdFV,
    jiraDefects30DaysDevFV,
    testCaseEffectivenessFV,
    jiraStories30DaysFV,
    defectDensityFV,
    defectResolutionTimeFV,
    defectseverityindexFV,
    releaseTestRuns,
  } = useLoaderData<typeof loader>();
  // const [params] = useSearchParams();
  const params = useParams();
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";

  // const testRailProjectId = params.get("testRailProject") || "4";
  // const jiraProjectId = params.get("jiraProject") || "PLAT";
  const testRailProjectId = params.trId;
  const jiraProjectId = params.jId;
  const fixVersion = params.fv;

  return (
    <>
      <Header
        testRailProjectId={testRailProjectId}
        jiraProjectId={jiraProjectId}
        fixVersionId={fixVersion}
      />

      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-500 text-3xl py-5">
          Data Loading.....
        </div>
      )}
      {/* <div className="flex justify-center items-center text-center pt-2">
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
                  defaultValue={jiraProjectId}
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
                  defaultValue={testRailProjectId}
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
      </div> */}

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
                    testRailProjectId={testRailProjectId}
                    jiraProjectId={jiraProjectId}
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
            <Link
              to={`/featurecoverage/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}`}
            >
              Feature Test Coverage
            </Link>
          </label>
          <label htmlFor="" className="text-blue-700 font-bold">
            <Link
              to={`/featurecoverage/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}`}
            >
              Click to learn more
            </Link>
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
                chartName="Resolved Stories + Bugs (30 Days)"
                count={jiraStories30Days.totalJiraIssues}
                page={`/stories/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/t`}
              />
            )}
          </Await>
        </Suspense>
      </div>

      <div className="grid grid-cols-5 py-20">
        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={jiraDefects30Days}>
            {(jiraDefects30Days) => (
              <CountVisualWithLink
                chartName="Defects (30 Days)"
                count={jiraDefects30Days.totalJiraIssues}
                page={`/defects30all/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/t`}
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
                page={`/defects30prod/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/t`}
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
                page={`/defects30dev/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/t`}
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
                page={`/defectseverityindex/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/t`}
              />
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<p>Loading Data.......</p>}>
          <Await resolve={jiraDefectsOpen}>
            {(jiraDefectsOpen) => (
              <CountVisualWithLink
                chartName="Open Bugs"
                count={jiraDefectsOpen.totalJiraIssues}
                page={`/defects/open/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}`}
              />
            )}
          </Await>
        </Suspense>
      </div>
      {fixVersion !== "NA" && (
        <>
          <div className="flex justify-center text-2xl underline">
            <h2 className="text-center font-bold text-blue-600 pb-10">
              Release {fixVersion}
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Suspense fallback={<p>Loading Data.......</p>}>
              <Await resolve={releaseTestRuns}>
                {(releaseTestRuns) => (
                  <>
                    {releaseTestRuns.map((run: TEST_RUN_DATA) => (
                      <StarbasePieChart
                        chartName={run.name!!}
                        passed={run.passed}
                        failed={run.failed}
                        blocked={run.blocked}
                        retest={run.retest}
                        untested={run.untested}
                        testRunId={run.id}
                        testRailProjectId={testRailProjectId}
                        jiraProjectId={jiraProjectId}
                      />
                    ))}
                  </>
                )}
              </Await>
            </Suspense>
          </div>
          <div className="grid grid-cols-4 gap-5">
            <Suspense fallback={<p>Loading Data.......</p>}>
              <Await resolve={defectDensityFV}>
                {(defectDensityFV) => (
                  <CountVisualWithTooltip
                    chartName="Defect Density"
                    count={parseFloat(defectDensityFV)}
                    tooltip="Number of defects divided by number of stories"
                  />
                )}
              </Await>
            </Suspense>

            <Suspense fallback={<p>Loading Data.......</p>}>
              <Await resolve={defectResolutionTimeFV}>
                {(defectResolutionTimeFV) => (
                  <CountVisualWithTooltip
                    chartName="Defect Resolution Time (Days)"
                    count={parseFloat(defectResolutionTimeFV?.toFixed(2)) || 0}
                    tooltip="Defect closure date minus defect creation date. Average number of days taken to fix bugs"
                  />
                )}
              </Await>
            </Suspense>

            <Suspense fallback={<p>Loading Data.......</p>}>
              <Await resolve={testCaseEffectivenessFV}>
                {(testCaseEffectivenessFV) => (
                  <CountVisualWithTooltip
                    chartName="Test Case Effectiveness"
                    count={parseFloat(testCaseEffectivenessFV)}
                    tooltip="Number of defects found divided by number of test cases executed"
                  />
                )}
              </Await>
            </Suspense>

            <Suspense fallback={<p>Loading Data.......</p>}>
              <Await resolve={jiraStories30DaysFV}>
                {(jiraStories30DaysFV) => (
                  <CountVisualWithLink
                    chartName="Resolved Stories + Bugs"
                    count={jiraStories30DaysFV.totalJiraIssues}
                    page={`/stories/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/f`}
                  />
                )}
              </Await>
            </Suspense>
          </div>

          <div className="grid grid-cols-4 gap-12 py-20">
            <Suspense fallback={<p>Loading Data.......</p>}>
              <Await resolve={jiraDefects30DaysFV}>
                {(jiraDefects30DaysFV) => (
                  <CountVisualWithLink
                    chartName="Defects"
                    count={jiraDefects30DaysFV.totalJiraIssues}
                    page={`/defects30all/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/f`}
                  />
                )}
              </Await>
            </Suspense>

            <Suspense fallback={<p>Loading Data.......</p>}>
              <Await resolve={jiraDefects30DaysProdFV}>
                {(jiraDefects30DaysProdFV) => (
                  <CountVisualWithLink
                    chartName="Defects Prod (Defect Leakage)"
                    count={jiraDefects30DaysProdFV.totalJiraIssues}
                    page={`/defects30prod/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/f`}
                  />
                )}
              </Await>
            </Suspense>

            <Suspense fallback={<p>Loading Data.......</p>}>
              <Await resolve={jiraDefects30DaysDevFV}>
                {(jiraDefects30DaysDevFV) => (
                  <CountVisualWithLink
                    chartName="Defects QA"
                    count={jiraDefects30DaysDevFV.totalJiraIssues}
                    page={`/defects30dev/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/f`}
                  />
                )}
              </Await>
            </Suspense>

            <Suspense fallback={<p>Loading Data.......</p>}>
              <Await resolve={defectseverityindexFV}>
                {(defectseverityindexFV) => (
                  <CountVisualWithLink
                    chartName="Defect Severity Index"
                    count={parseFloat(defectseverityindexFV)}
                    page={`/defectseverityindex/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersion}/f`}
                  />
                )}
              </Await>
            </Suspense>
          </div>
        </>
      )}
    </>
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  // const url = new URL(request.url);
  // const search = new URLSearchParams(url.search);

  // const testRailProjects = getTestRailProjects();

  // const selectedTestRailProject = search.get("testRailProject") || "4";

  // const jiraProjects = getJiraProjects();

  // const selectedJiraProject = search.get("jiraProject") || "PLAT";

  const selectedTestRailProject = params.trId;
  const selectedJiraProject = params.jId;
  const fixVersion = params.fv;

  const testRuns = getCurrentTestRuns(selectedTestRailProject);

  const totalTestsExecuted = getTotalTestsExecuted(testRuns);

  const jiraDefects30Days = getJiraBugs30Days(selectedJiraProject, "NA");
  const jiraDefects30DaysProd = getJiraBugs30DaysProd(
    selectedJiraProject,
    "NA"
  );
  const jiraDefects30DaysDev = getJiraBugs30DaysDev(selectedJiraProject, "NA");
  const jiraStories30Days = getJiraStories30Days(selectedJiraProject, "NA");

  const jiraDefectsResolved30Days = getResolvedJiraBugs30Days(
    selectedJiraProject,
    "NA"
  );

  const testCaseEffectiveness = getTestCaseEffectiveness(
    jiraDefects30Days,
    totalTestsExecuted
  );

  const defectDensity = getDefectDensity(jiraDefects30Days, jiraStories30Days);

  const defectResolutionTime = getJiraDefectResolutionTime(
    jiraDefectsResolved30Days
  );

  const defectseverityindex = getDefectSeverityIndex(jiraDefects30Days);

  const jiraDefectsOpen = getJiraBugsOpened(selectedJiraProject, "NA");

  // fix version
  const jiraDefects30DaysFV =
    fixVersion === "NA"
      ? null
      : getJiraBugs30Days(selectedJiraProject, fixVersion);
  const jiraDefects30DaysProdFV =
    fixVersion === "NA"
      ? null
      : getJiraBugs30DaysProd(selectedJiraProject, fixVersion);
  const jiraDefects30DaysDevFV =
    fixVersion === "NA"
      ? null
      : getJiraBugs30DaysDev(selectedJiraProject, fixVersion);
  const jiraStories30DaysFV =
    fixVersion === "NA"
      ? null
      : getJiraStories30Days(selectedJiraProject, fixVersion);

  const jiraDefectsResolved30DaysFV =
    fixVersion === "NA"
      ? null
      : getResolvedJiraBugs30Days(selectedJiraProject, fixVersion);

  const testCaseEffectivenessFV =
    fixVersion === "NA"
      ? null
      : getTestCaseEffectiveness(jiraDefects30DaysFV, totalTestsExecuted);

  const defectDensityFV =
    fixVersion === "NA"
      ? null
      : getDefectDensity(jiraDefects30DaysFV, jiraStories30DaysFV);

  const defectResolutionTimeFV =
    fixVersion === "NA"
      ? null
      : getJiraDefectResolutionTime(jiraDefectsResolved30DaysFV);

  const defectseverityindexFV =
    fixVersion === "NA" ? null : getDefectSeverityIndex(jiraDefects30DaysFV);

  //filter fix version by name to get the fix version jira reference id
  const releaseVersions = await getJiraFixVersions(selectedJiraProject);

  const [dan] = releaseVersions.filter(
    (rv: any) => rv.versionName === fixVersion
  );

  const releaseTestRuns =
    fixVersion === "NA"
      ? null
      : getReleaseTestRuns(selectedTestRailProject, dan.versionId);

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
    jiraDefectsOpen,

    jiraDefects30DaysFV,
    jiraDefects30DaysProdFV,
    jiraDefects30DaysDevFV,
    testCaseEffectivenessFV,
    jiraStories30DaysFV,
    defectDensityFV,
    defectResolutionTimeFV,
    defectseverityindexFV,
    releaseTestRuns,
  });
}
