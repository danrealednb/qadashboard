import { type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CountVisualWithLink from "~/components/ChartVisualWithLink";
import CountVisual from "~/components/CountVisual";
import CountVisualWithTooltip from "~/components/CountVisualWithToolTip";

import Header from "~/components/Header";
import PercentageVisual from "~/components/PercentageVisual";

import StarbasePieChart from "~/components/StarbasePieChart";

import {
  getJiraBugs30Days,
  getJiraBugs30DaysDev,
  getJiraBugs30DaysProd,
  getJiraStories30Days,
} from "~/data/jira.server";
import { getCurrentTestRuns, TEST_RUN_DATA } from "~/data/testrail.server";

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
  } = useLoaderData<typeof loader>();

  return (
    <>
      <Header />
      <div className="grid grid-cols-4">
        {testRuns.map((run: TEST_RUN_DATA) => (
          <StarbasePieChart
            chartName={run.name!!}
            passed={run.passed}
            failed={run.failed}
            blocked={run.blocked}
            retest={run.retest}
            untested={run.untested}
          />
        ))}
      </div>
      <div className="grid grid-cols-5">
        <PercentageVisual
          chartName="Test Coverage"
          percentage="12.54"
          tooltip="Test cases for Jira tickets"
        />
        <CountVisualWithTooltip
          chartName="Defect Density"
          count={parseFloat(defectDensity)}
          tooltip="Number of defects divided by number of stories"
        />
        <PercentageVisual
          chartName="Defect Resolution Time"
          percentage="12.54"
          tooltip="Defect closure date minus defect creation date"
        />
        <CountVisual
          chartName="Test Case Effectiveness"
          count={parseFloat(testCaseEffectiveness)}
        />
        <CountVisual
          chartName="Total Stories Completed"
          count={jiraStories30Days.totalJiraIssues}
        />
      </div>
      <div className="grid grid-cols-3 py-20">
        <CountVisualWithLink
          chartName="Defects (30 Days)"
          count={jiraDefects30Days.totalJiraIssues}
          page="/defects30all"
        />
        <CountVisualWithLink
          chartName="Defects Prod (30 Days) (Defect Leakage)"
          count={jiraDefects30DaysProd.totalJiraIssues}
          page="/defects30prod"
        />
        <CountVisualWithLink
          chartName="Defects Dev (30 Days)"
          count={jiraDefects30DaysDev.totalJiraIssues}
          page="/defects30dev"
        />
      </div>
    </>
  );
}

export async function loader() {
  const testRuns = await getCurrentTestRuns();
  const totalTestsExecuted = testRuns.reduce((accumulator, currentValue) => {
    return (
      accumulator +
      currentValue.passed +
      currentValue.failed +
      currentValue.retest +
      currentValue.blocked
    );
  }, 0);

  const jiraDefects30Days = await getJiraBugs30Days();
  const jiraDefects30DaysProd = await getJiraBugs30DaysProd();
  const jiraDefects30DaysDev = await getJiraBugs30DaysDev();
  const jiraStories30Days = await getJiraStories30Days();

  const testCaseEffectiveness = (
    (jiraDefects30Days.totalJiraIssues / totalTestsExecuted) *
    100
  ).toFixed(2);

  const defectDensity = (
    (jiraDefects30Days.totalJiraIssues / jiraStories30Days.totalJiraIssues) *
    100
  ).toFixed(2);

  return {
    testRuns,
    jiraDefects30Days,
    jiraDefects30DaysProd,
    jiraDefects30DaysDev,
    testCaseEffectiveness,
    jiraStories30Days,
    defectDensity,
  };
}
