import { useLoaderData } from "@remix-run/react";
import CountPercentageVisual from "~/components/CountPercentageVisual";
import CountVisual from "~/components/CountVisual";
import Header from "~/components/Header";
import {
  getAllTestCases,
  getAutomatedTests,
  getManualTests,
  getPercentage,
  getTestTypeTests,
} from "~/data/testrail.server";

export default function Breakdowns() {
  const {
    automatedTests,
    manualTests,
    accessibilityTests,
    dataValidationTests,
    e2eTests,
    functionalTests,
    integrationTests,
    performanceTests,
    loadTests,
    regressionTests,
    securityTests,
    smokeTests,
    unitTests,
    nonFunctionalTests,
  } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">
        Test Type Breakdown
      </h1>

      <div className="grid grid-cols-3 py-10">
        <CountVisual chartName="Total Tests" count={automatedTests.count} />
        <CountPercentageVisual
          chartName="Automated Tests"
          count={automatedTests.count}
          percentage={automatedTests.percentage}
          page="/automatedtests"
        />
        <CountPercentageVisual
          chartName="Manual Tests"
          count={manualTests.count}
          percentage={manualTests.percentage}
          page="/manualtests"
        />
      </div>
      <div className="grid grid-cols-4 py-10">
        <CountPercentageVisual
          chartName="Accessibility Tests"
          count={accessibilityTests.count}
          percentage={accessibilityTests.percentage}
          page="/accessibilitytests"
        />
        <CountPercentageVisual
          chartName="Data Validation Tests"
          count={dataValidationTests.count}
          percentage={dataValidationTests.percentage}
          page="/datavalidationtests"
        />
        <CountPercentageVisual
          chartName="E2E Tests"
          count={e2eTests.count}
          percentage={e2eTests.percentage}
          page="/e2etests"
        />
        <CountPercentageVisual
          chartName="Functional Tests"
          count={functionalTests.count}
          percentage={functionalTests.percentage}
          page="/functionaltests"
        />
      </div>

      <div className="grid grid-cols-4 py-10">
        <CountPercentageVisual
          chartName="Integration Tests"
          count={integrationTests.count}
          percentage={integrationTests.percentage}
          page="/integrationtests"
        />
        <CountPercentageVisual
          chartName="Performance Tests"
          count={performanceTests.count}
          percentage={performanceTests.percentage}
          page="/performancetests"
        />
        <CountPercentageVisual
          chartName="Load Tests"
          count={loadTests.count}
          percentage={loadTests.percentage}
          page="/loadtests"
        />
        <CountPercentageVisual
          chartName="Regression Tests"
          count={regressionTests.count}
          percentage={regressionTests.percentage}
          page="/regressiontests"
        />
      </div>

      <div className="grid grid-cols-4 py-10">
        <CountPercentageVisual
          chartName="Security Tests"
          count={securityTests.count}
          percentage={securityTests.percentage}
          page="/securitytests"
        />
        <CountPercentageVisual
          chartName="Smoke Tests"
          count={smokeTests.count}
          percentage={smokeTests.percentage}
          page="/smoketests"
        />
        <CountPercentageVisual
          chartName="Unit Tests"
          count={unitTests.count}
          percentage={unitTests.percentage}
          page="/unittests"
        />
        <CountPercentageVisual
          chartName="Non-Functional Tests"
          count={nonFunctionalTests.count}
          percentage={nonFunctionalTests.percentage}
          page="/nonfunctionaltests"
        />
      </div>
    </>
  );
}

export async function loader() {
  const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);
  const totalTestCases = testCaseData.length;

  const automatedTests = getAutomatedTests(testCaseData);
  const automatedTestPercentage = getPercentage(
    automatedTests.length,
    totalTestCases
  );
  const manualTests = getManualTests(testCaseData);
  const manualTestPercentage = getPercentage(
    manualTests.length,
    totalTestCases
  );

  const accessibilityTests = getTestTypeTests(testCaseData, 1);
  const accessibilityTestPercentage = getPercentage(
    accessibilityTests.length,
    totalTestCases
  );

  const dataValidationTests = getTestTypeTests(testCaseData, 2);
  const dataValidationTestPercentage = getPercentage(
    dataValidationTests.length,
    totalTestCases
  );

  const e2eTests = getTestTypeTests(testCaseData, 3);
  const e2eTestPercentage = getPercentage(e2eTests.length, totalTestCases);

  const functionalTests = getTestTypeTests(testCaseData, 4);
  const functionalTestPercentage = getPercentage(
    functionalTests.length,
    totalTestCases
  );

  const integrationTests = getTestTypeTests(testCaseData, 5);
  const integrationTestPercentage = getPercentage(
    integrationTests.length,
    totalTestCases
  );
  const performanceTests = getTestTypeTests(testCaseData, 6);
  const performanceTestPercentage = getPercentage(
    performanceTests.length,
    totalTestCases
  );

  const loadTests = getTestTypeTests(testCaseData, 7);
  const loadTestPercentage = getPercentage(loadTests.length, totalTestCases);

  const regressionTests = getTestTypeTests(testCaseData, 8);
  const regressionTestPercentage = getPercentage(
    regressionTests.length,
    totalTestCases
  );

  const securityTests = getTestTypeTests(testCaseData, 9);
  const securityTestPercentage = getPercentage(
    securityTests.length,
    totalTestCases
  );

  const smokeTests = getTestTypeTests(testCaseData, 10);
  const smokeTestPercentage = getPercentage(smokeTests.length, totalTestCases);

  const unitTests = getTestTypeTests(testCaseData, 11);
  const unitTestPercentage = getPercentage(unitTests.length, totalTestCases);

  const nonFunctionalTests = getTestTypeTests(testCaseData, 13);
  const nonFunctionalTestPercentage = getPercentage(
    nonFunctionalTests.length,
    totalTestCases
  );

  return {
    automatedTests: {
      data: automatedTests,
      count: automatedTests.length,
      percentage: automatedTestPercentage,
    },
    manualTests: {
      data: manualTests,
      count: manualTests.length,
      percentage: manualTestPercentage,
    },
    accessibilityTests: {
      data: accessibilityTests,
      count: accessibilityTests.length,
      percentage: accessibilityTestPercentage,
    },
    dataValidationTests: {
      data: dataValidationTests,
      count: dataValidationTests.length,
      percentage: dataValidationTestPercentage,
    },
    e2eTests: {
      data: e2eTests,
      count: e2eTests.length,
      percentage: e2eTestPercentage,
    },
    functionalTests: {
      data: functionalTests,
      count: functionalTests.length,
      percentage: functionalTestPercentage,
    },
    integrationTests: {
      data: integrationTests,
      count: integrationTests.length,
      percentage: integrationTestPercentage,
    },
    performanceTests: {
      data: performanceTests,
      count: performanceTests.length,
      percentage: performanceTestPercentage,
    },
    loadTests: {
      data: loadTests,
      count: loadTests.length,
      percentage: loadTestPercentage,
    },
    regressionTests: {
      data: regressionTests,
      count: regressionTests.length,
      percentage: regressionTestPercentage,
    },
    securityTests: {
      data: securityTests,
      count: securityTests.length,
      percentage: securityTestPercentage,
    },
    smokeTests: {
      data: smokeTests,
      count: smokeTests.length,
      percentage: smokeTestPercentage,
    },
    unitTests: {
      data: unitTests,
      count: unitTests.length,
      percentage: unitTestPercentage,
    },

    nonFunctionalTests: {
      data: nonFunctionalTests,
      count: nonFunctionalTests.length,
      percentage: nonFunctionalTestPercentage,
    },
  };
}
