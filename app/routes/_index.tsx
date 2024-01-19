import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CountPercentageVisual from "~/components/CountPercentageVisual";
import Header from "~/components/Header";
import PercentageVisual from "~/components/PercentageVisual";

import StarbasePieChart from "~/components/StarbasePieChart";
import BasicTooltip from "~/components/Tooltip";
import {
  getAllTestCases,
  getAutomatedTests,
  getCurrentTestRuns,
  getManualTests,
  getPercentage,
  TEST_RUN_DATA,
  testRunChartData,
} from "~/data/testrail.server";

export const meta: MetaFunction = () => {
  return [
    { title: "QA Dashboard" },
    { name: "description", content: "Starbase QA Metrics Dashboard" },
  ];
};

export default function Index() {
  const {
    testRuns,
    manualTests,
    manualTestPercentage,
    automatedTests,
    automatedTestPercentage,
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
      <div className="grid grid-cols-4 py-10">
        <PercentageVisual
          chartName="Defect Leakage"
          percentage="3"
          tooltip="Number of defects found in production by end users"
        />
        <CountPercentageVisual
          chartName="Automated Tests"
          count={automatedTests.length}
          percentage={automatedTestPercentage}
          page="/automatedtests"
        />
        <CountPercentageVisual
          chartName="Manual Tests"
          count={manualTests.length}
          percentage={manualTestPercentage}
          page="/manualtests"
        />
      </div>
      {/* <div>
        <ul className="grid justify-center space-y-2">
          {testRailData.map((testEntry: any, index: number) => (
            <li className="grid justify-center" key={index}>
              <label htmlFor="">Test Id {testEntry.test_id}</label>
              <label htmlFor="">Status {testEntry.status_id}</label>
              <label htmlFor="">Created On {testEntry.created_on}</label>
              <label htmlFor="">Environment {testEntry.version}</label>
              <label htmlFor="">Duration {testEntry.elapsed}</label>
            </li>
          ))}
        </ul>
      </div> */}
    </>
  );
}

export async function loader() {
  // const headers = {
  //   Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  // };
  // const res = await fetch(
  //   `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_results_for_run/2`,
  //   { headers }
  // );
  // const data = await res.json();
  // const numberOfTestCaseResultsInRun = data.size;
  // console.log(numberOfTestCaseResultsInRun);
  // console.log(data.results.length);
  // const testRailData = data.results;
  // // console.log(testRailData);

  // // return json(await res.json());
  // return testRailData;

  const testRuns = await getCurrentTestRuns();
  // console.log(testRuns);

  // const testRunData = []
  // for (let index = 0; index < testRuns.length; index++) {
  //   const element = testRuns[index];
  //   const metricData = testRunChartData(element);
  //   console.log(metricData);
  //   // testRunData.push(metricData)
  // }
  const testCaseData = await getAllTestCases();
  const totalTestCases = testCaseData.length;
  const manualTests = getManualTests(testCaseData);
  const automatedTests = getAutomatedTests(testCaseData);
  const automatedTestPercentage = getPercentage(
    automatedTests.length,
    totalTestCases
  );
  const manualTestPercentage = getPercentage(
    manualTests.length,
    totalTestCases
  );

  return {
    testRuns,
    manualTests,
    manualTestPercentage,
    automatedTests,
    automatedTestPercentage,
  };
}
