import { type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CountVisualWithLink from "~/components/ChartVisualWithLink";

import Header from "~/components/Header";
import PercentageVisual from "~/components/PercentageVisual";

import StarbasePieChart from "~/components/StarbasePieChart";

import {
  getJiraBugs30Days,
  getJiraBugs30DaysDev,
  getJiraBugs30DaysProd,
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
      <div className="grid grid-cols-4">
        <PercentageVisual
          chartName="Test Coverage"
          percentage="12.54"
          tooltip="Test cases for Jira tickets"
        />
        <PercentageVisual
          chartName="Defect Density"
          percentage="12.54"
          tooltip="Number of defects divided by number of stories"
        />
        <PercentageVisual
          chartName="Defect Resolution Time"
          percentage="12.54"
          tooltip="Defect closure date minus defect creation date"
        />
        <PercentageVisual
          chartName="Test Case Effectiveness"
          percentage="12.54"
          tooltip="Number of defects found divided by number of test cases executed"
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

  const jiraDefects30Days = await getJiraBugs30Days();
  const jiraDefects30DaysProd = await getJiraBugs30DaysProd();
  const jiraDefects30DaysDev = await getJiraBugs30DaysDev();

  return {
    testRuns,
    jiraDefects30Days,
    jiraDefects30DaysProd,
    jiraDefects30DaysDev,
  };
}
