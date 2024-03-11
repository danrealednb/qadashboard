import { JIRA_ISSUE_DATA, JIRA_ISSUE_STORY_DATA } from "./jira.server";
import { testTypeMapping } from "~/utils/testTypes";

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
  id: number;
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

export async function getCurrentTestRuns(projectId: string) {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  //   const res = await fetch(
  //     `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_results_for_run/2`,
  //     { headers }
  //   );
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_runs/${projectId}&is_completed=0`,
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
      id: element.id,
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
export interface TEST_CASE_STR {
  id: number;
  title: string;
  refs: string | null;
  custom_automated_test: number;
  custom_test_case_type: Array<string> | null;
}
export interface TEST_CASE_RESULT {
  title: string;
  refs: string | null;
  test_case_type: Array<number> | undefined | null;
  status: string;
}

// let offsetAmount = 0;
// const allTestData: any = [];
// export async function dan() {
//   const allTestData: any = [];
//   await getTestCasesFromTestRail(0);
// }
export async function getTestCasesFromTestRail(
  projectId: string,
  offset: number = 0
) {
  const allTestData: any = [];
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_cases/${projectId}&suite_id=1&offset=${offset}`,
    { headers }
  );
  const data = await res.json();
  const fullTestCaseData = data.cases;
  if (data.size < 250) {
    // don't need to do anything else, just return the data
    allTestData.push(...fullTestCaseData);
    return allTestData;
  } else {
    // need to get more data
    const offsetTestData = await getTestCasesFromTestRail(
      projectId,
      offset + 250
    );
    allTestData.push(...fullTestCaseData);
    allTestData.push(...offsetTestData);
    return allTestData;
  }
}

export async function getAllTestCases(projectId: string) {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_cases/${projectId}&suite_id=1`,
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

export const getTestTypesToStr = (testTypes: Array<number>) => {
  const mappedTypes = testTypes
    .map((test: number) => testTypeMapping(test))
    .join(",");
  return mappedTypes;
};

// export const testTypeMapping = (testType: number) => {
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
//       return "Non-Functional";
//     case 13:
//       return "Other";
//     default:
//       return "NA";
//   }
// };

export async function getTestsInTestRun(
  projectId: string,
  offset: number = 0,
  testRun: string | number
) {
  const allTestData: any = [];
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_tests/${testRun}&offset=${offset}`,
    { headers }
  );
  const data = await res.json();
  const fullTestCaseData = data.tests;
  if (data.size < 250) {
    // don't need to do anything else, just return the data
    allTestData.push(...fullTestCaseData);
    // const formatedTestRunData = strippedDownTestRunData(allTestData);
    // console.log(formatedTestRunData.length);
    // return res;
    return allTestData;
  } else {
    // need to get more data
    const offsetTestData = await getTestCasesFromTestRail(
      projectId,
      offset + 250
    );
    allTestData.push(...fullTestCaseData);
    allTestData.push(...offsetTestData);
    return allTestData;
  }
}

export const strippedDownTestRunData = (testData: Array<any>) => {
  const results = testData.map((test: any) => ({
    status: getTestRailStatus(test.status_id),
    title: test.title,
    refs: test.refs,
    test_case_type: test.custom_test_case_type,
  }));
  return results;
};

const getTestRailStatus = (status: number) => {
  switch (status) {
    case 1:
      return "Passed";
    case 2:
      return "Blocked";
    case 3:
      return "Untested";
    case 4:
      return "Retest";
    case 5:
      return "Failed";
    default:
      return "Untested";
  }
};

export async function getTotalTestsExecuted(
  testRuns: Promise<TEST_RUN_DATA[]>
) {
  const tr = await testRuns;
  const totalTestsExecuted = tr.reduce((accumulator, currentValue) => {
    return (
      accumulator +
      currentValue.passed +
      currentValue.failed +
      currentValue.retest +
      currentValue.blocked
    );
  }, 0);
  return totalTestsExecuted;
}

export async function getTestCasesFromTestRailV2(
  projectId: string,
  offset: number = 0
) {
  const allTestData: any = [];
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_cases/${projectId}&suite_id=1&offset=${offset}`,
    { headers }
  );
  const data = await res.json();
  const fullTestCaseData = data.cases;
  if (data.size < 250) {
    // don't need to do anything else, just return the data
    const scrubbedData = fullTestCaseData.map((testCase: TEST_CASE) => {
      return {
        id: testCase.id,
        title: testCase.title,
        refs: testCase.refs,
        custom_automated_test: testCase.custom_automated_test,
        custom_test_case_type: testCase.custom_test_case_type || null,
      };
    });

    allTestData.push(...scrubbedData);
    return allTestData;
  } else {
    // need to get more data
    const offsetTestData = await getTestCasesFromTestRail(
      projectId,
      offset + 250
    );
    const scrubbedData = fullTestCaseData.map((testCase: TEST_CASE) => {
      return {
        id: testCase.id,
        title: testCase.title,
        refs: testCase.refs,
        custom_automated_test: testCase.custom_automated_test,
        custom_test_case_type: testCase.custom_test_case_type || null,
      };
    });
    allTestData.push(...scrubbedData);
    const scrubbedData2 = offsetTestData.map((testCase: TEST_CASE) => {
      return {
        id: testCase.id,
        title: testCase.title,
        refs: testCase.refs,
        custom_automated_test: testCase.custom_automated_test,
        custom_test_case_type: testCase.custom_test_case_type || null,
      };
    });
    allTestData.push(...scrubbedData2);
    return allTestData;
  }
}

export const getJiraRefTests = (
  testCases: Array<TEST_CASE>,
  jiraReference: string
) => {
  return testCases.filter((test: TEST_CASE) =>
    test.refs?.split(",").includes(jiraReference)
  );
};

export interface TEST_COVERAGE {
  key: string;
  title: string;
  startDate: string;
  completeDate: string;
  coverage: boolean;
  tests: Array<TEST_CASE_STR> | null | undefined;
  issueType: string;
}
export const getJiraRefTestsV2 = (
  jiraStories: Array<JIRA_ISSUE_DATA>,
  testCases: Array<TEST_CASE>
) => {
  const testCoverage: Array<TEST_COVERAGE> = [];
  for (let index = 0; index < jiraStories.length; index++) {
    const element = jiraStories[index];
    const tests = testCases.filter((test: TEST_CASE) =>
      test.refs?.split(",").includes(element.key)
    );

    const newTest: Array<TEST_CASE_STR> = tests.map((t: TEST_CASE) => {
      return {
        id: t.id,
        title: t.title,
        refs: t.refs,
        custom_automated_test: t.custom_automated_test,
        custom_test_case_type: t.custom_test_case_type
          ? getTestTypesToStr(t.custom_test_case_type)
          : ["Other"],
      };
    });

    const obj: TEST_COVERAGE = {
      key: element.key,
      title: element.title,
      startDate: element.startDate,
      completeDate: element.completeDate,
      coverage: tests.length > 0 ? true : false,
      tests: newTest,
      issueType: element.issueType,
    };
    testCoverage.push(obj);
  }
  return testCoverage;
};

export const getJiraRefTestsV3 = (
  jiraStories: Array<JIRA_ISSUE_STORY_DATA>,
  testCases: Array<TEST_CASE>
) => {
  const testCoverage: Array<TEST_COVERAGE> = [];
  for (let index = 0; index < jiraStories.length; index++) {
    const element = jiraStories[index];
    const tests = testCases.filter((test: TEST_CASE) =>
      test.refs?.split(",").includes(element.key)
    );

    const newTest: Array<TEST_CASE_STR> = tests.map((t: TEST_CASE) => {
      return {
        id: t.id,
        title: t.title,
        refs: t.refs,
        custom_automated_test: t.custom_automated_test,
        custom_test_case_type: t.custom_test_case_type
          ? getTestTypesToStr(t.custom_test_case_type)
          : ["Other"],
      };
    });

    const obj: TEST_COVERAGE = {
      key: element.key,
      title: element.title,
      startDate: element.startDate,
      completeDate: element.completeDate,
      coverage: tests.length > 0 ? true : false,
      tests: newTest,
      issueType: element.issueType,
    };
    testCoverage.push(obj);
  }
  return testCoverage;
};

export async function getCustomTestCaseTypes() {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_case_fields`,
    { headers }
  );
  const data = await res.json();
  //   const numberOfTestCaseResultsInRun = data.size;
  //   console.log(numberOfTestCaseResultsInRun);
  //   console.log(data.results.length);
  const testCaseTypes = data.filter(
    (tct: any) => tct.name === "test_case_type"
  );

  const tcs = testCaseTypes[0].configs[0].options.items.split("\n");
  // console.log(tcs);

  const testCaseTypesList = [];
  for (const casetype of tcs) {
    const tctype = casetype.split(", ");
    const obj = {
      testCaseTypeId: tctype[0],
      testCaseType: tctype[1],
    };
    testCaseTypesList.push(obj);
    // console.log(obj);
  }

  return testCaseTypesList;
}

export async function getTestCaseTypes() {
  if (process.env.TEST_CASE_TYPES === "default") {
    const headers = {
      Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
    };
    const res = await fetch(
      `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_case_types`,
      { headers }
    );
    const data = await res.json();
    const testCaseTypesList = [];
    for (const casetype of data) {
      const obj = {
        testCaseTypeId: casetype.id,
        testCaseType: casetype.name,
      };
      testCaseTypesList.push(obj);
      // console.log(obj);
    }

    return testCaseTypesList;
  } else if (process.env.TEST_CASE_TYPES === "custom") {
    const headers = {
      Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
    };
    const res = await fetch(
      `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_case_fields`,
      { headers }
    );
    const data = await res.json();
    //   const numberOfTestCaseResultsInRun = data.size;
    //   console.log(numberOfTestCaseResultsInRun);
    //   console.log(data.results.length);
    const testCaseTypes = data.filter(
      (tct: any) => tct.name === process.env.CUSTOM_TEST_CASE_TYPE_NAME
    );

    const tcs = testCaseTypes[0].configs[0].options.items.split("\n");
    // console.log(tcs);

    const testCaseTypesList = [];
    for (const casetype of tcs) {
      const tctype = casetype.split(", ");
      const obj = {
        testCaseTypeId: tctype[0],
        testCaseType: tctype[1],
      };
      testCaseTypesList.push(obj);
      // console.log(obj);
    }

    return testCaseTypesList;
  }
}
export async function getAutomatedTypes() {
  if (process.env.TEST_CASE_TYPES === "default") {
    const headers = {
      Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
    };
    const res = await fetch(
      `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_case_types`,
      { headers }
    );
    const data = await res.json();
    const testCaseTypesList = [];
    for (const casetype of data) {
      const obj = {
        testCaseTypeId: casetype.id,
        testCaseType: casetype.name,
      };
      testCaseTypesList.push(obj);
      // console.log(obj);
    }

    return testCaseTypesList;
  } else if (process.env.TEST_CASE_TYPES === "custom") {
    const headers = {
      Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
    };
    const res = await fetch(
      `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_case_fields`,
      { headers }
    );
    const data = await res.json();
    //   const numberOfTestCaseResultsInRun = data.size;
    //   console.log(numberOfTestCaseResultsInRun);
    //   console.log(data.results.length);
    const testCaseTypes = data.filter(
      (tct: any) => tct.name === process.env.CUSTOM_AUTOMATED_STATUS_NAME
    );

    const tcs = testCaseTypes[0].configs[0].options.items.split("\n");
    // console.log(tcs);

    const testCaseTypesList = [];
    for (const casetype of tcs) {
      const tctype = casetype.split(", ");
      const obj = {
        testCaseTypeId: tctype[0],
        testCaseType: tctype[1],
      };
      testCaseTypesList.push(obj);
      // console.log(obj);
    }

    return testCaseTypesList;
  }
}

export async function getTestRailProjects() {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_projects&is_completed=0`,
    { headers }
  );
  const data = await res.json();

  return data;
}

export async function getTestRailMilestones(projectId: string) {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_milestones/${projectId}`,
    { headers }
  );
  const data = await res.json();
  const milestones = await data.milestones;

  return milestones;
}

export async function getSprintTestRuns(
  projectId: string,
  milestoneId: string
) {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_runs/${projectId}&milestone_id=${milestoneId}`,
    { headers }
  );
  const data = await res.json();

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
      id: element.id,
    };
    testRunData.push(obj);
  }
  return testRunData;
}

export async function getReleaseTestRuns(
  projectId: string,
  jiraReferenceId: string
) {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_runs/${projectId}&refs=${jiraReferenceId}`,
    { headers }
  );
  const data = await res.json();

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
      id: element.id,
    };
    testRunData.push(obj);
  }
  return testRunData;
}
