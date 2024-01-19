export interface DATA_POINT {
  name: string;
  value: number;
}

export interface TEST_RUN_DATA {
  passed: number;
  failed: number;
  blocked: number;
  retest: number;
  untested: number;
  name?: string;
}

export const testRunChartData = (data: TEST_RUN_DATA) => {
  delete data.name;
  const chartData = [];
  for (const [key, value] of Object.entries(data)) {
    let obj: DATA_POINT = {
      name: key,
      value: value,
    };
    chartData.push(obj);
  }
  return chartData;
};

export async function getCurrentTestRuns() {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  //   const res = await fetch(
  //     `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_results_for_run/2`,
  //     { headers }
  //   );
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_runs/1&is_completed=0`,
    { headers }
  );
  const data = await res.json();
  //   const numberOfTestCaseResultsInRun = data.size;
  //   console.log(numberOfTestCaseResultsInRun);
  //   console.log(data.results.length);
  const testRailData = data.runs;

  let testRunData = [];

  for (let index = 0; index < testRailData.length; index++) {
    const element = testRailData[index];

    const obj: TEST_RUN_DATA = {
      passed: element.passed_count,
      failed: element.failed_count,
      retest: element.retest_count,
      blocked: element.blocked_count,
      untested: element.untested_count,
      name: element.name,
    };
    testRunData.push(obj);
  }
  return testRunData;
}

export interface TEST_CASE {
  id: number;
  title: string;
  refs: string | null;
  custom_automated_test: number;
  custom_test_case_type: Array<number> | undefined | null;
}

export async function getAllTestCases() {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_cases/1&suite_id=1`,
    { headers }
  );
  const data = await res.json();

  const fullTestCaseData = data.cases;

  const scrubbedTestCaseData = [];
  for (let index = 0; index < fullTestCaseData.length; index++) {
    const element = fullTestCaseData[index];
    const obj: TEST_CASE = {
      id: element.id,
      title: element.title,
      refs: element.refs,
      custom_automated_test: element.custom_automated_test,
      custom_test_case_type: element.custom_test_case_type || null,
    };
    scrubbedTestCaseData.push(obj);
  }
  return scrubbedTestCaseData;
}

export const getAutomatedTests = (testCases: Array<TEST_CASE>) => {
  return testCases.filter(
    (test: TEST_CASE) => test.custom_automated_test === 1
  );
};
export const getManualTests = (testCases: Array<TEST_CASE>) => {
  return testCases.filter(
    (test: TEST_CASE) => test.custom_automated_test === 0
  );
};

export const getTestTypeTests = (
  testCases: Array<TEST_CASE>,
  testType: number
) => {
  return testCases.filter((test: TEST_CASE) =>
    test.custom_test_case_type?.includes(testType)
  );
};

export const getPercentage = (metric: number, totalTestCases: number) => {
  const percentage = ((metric / totalTestCases) * 100).toFixed(2);
  return percentage.toString();
};

// export const getTestTypesToStr = (testTypes: Array<number>) => {
//   const mappedTypes = testTypes
//     .map((test: number) => testTypeMapping(test))
//     .join(",");
//   return mappedTypes;
// };

// const testTypeMapping = (testType: number) => {
//   switch (testType) {
//     case 1:
//       return "Accessibility";
//     case 2:
//       return "Data Validation";
//     case 3:
//       return "E2E";
//     case 4:
//       return "Functional";
//     case 5:
//       return "Integration";
//     case 6:
//       return "Performance";
//     case 7:
//       return "Load";
//     case 8:
//       return "Regression";
//     case 9:
//       return "Security";
//     case 10:
//       return "Smoke";
//     case 11:
//       return "Unit";
//     case 12:
//       return "Other";
//     case 13:
//       return "Non-Functional";
//     default:
//       return "NA";
//   }
// };
