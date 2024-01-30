import { type MetaFunction } from "@remix-run/node";
import { useLoaderData, Await, Link } from "@remix-run/react";
import CountVisualWithLink from "~/components/ChartVisualWithLink";
import CountVisual from "~/components/CountVisual";
import CountVisualWithTooltip from "~/components/CountVisualWithToolTip";

import Header from "~/components/Header";
import PercentageVisual from "~/components/PercentageVisual";

import StarbasePieChart from "~/components/StarbasePieChart";

import {
  getDefectDensity,
  getJiraBugs30Days,
  getJiraBugs30DaysDev,
  getJiraBugs30DaysProd,
  getJiraDefectResolutionTime,
  getJiraStories30Days,
  getResolvedJiraBugs30Days,
  getTestCaseEffectiveness,
} from "~/data/jira.server";
import {
  getCurrentTestRuns,
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
  } = useLoaderData<typeof loader>();

  return (
    <>
      <Header />

      <div className="grid grid-cols-4">
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
                chartName="Defect Resolution Time"
                count={parseFloat(defectResolutionTime.toFixed(2))}
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
              <CountVisual
                chartName="Total Stories Completed"
                count={jiraStories30Days.totalJiraIssues}
              />
            )}
          </Await>
        </Suspense>
      </div>

      <div className="grid grid-cols-3 py-20">
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
      </div>
    </>
  );
}

export async function loader() {
  const testRuns = getCurrentTestRuns();

  const totalTestsExecuted = getTotalTestsExecuted(testRuns);

  const jiraDefects30Days = getJiraBugs30Days();
  const jiraDefects30DaysProd = getJiraBugs30DaysProd();
  const jiraDefects30DaysDev = getJiraBugs30DaysDev();
  const jiraStories30Days = getJiraStories30Days();

  const jiraDefectsResolved30Days = getResolvedJiraBugs30Days();

  const testCaseEffectiveness = getTestCaseEffectiveness(
    jiraDefects30Days,
    totalTestsExecuted
  );

  const defectDensity = getDefectDensity(jiraDefects30Days, jiraStories30Days);

  const defectResolutionTime = getJiraDefectResolutionTime(
    jiraDefectsResolved30Days
  );

  return defer({
    testRuns,
    jiraDefects30Days,
    jiraDefects30DaysProd,
    jiraDefects30DaysDev,
    testCaseEffectiveness,
    jiraStories30Days,
    defectDensity,
    defectResolutionTime,
  });
}
