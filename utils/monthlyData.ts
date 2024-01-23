import * as dotenv from "dotenv";
dotenv.config();
import {
  getDefectResolutionTime,
  getJiraBugs30Days,
  getJiraBugs30DaysDev,
  getJiraBugs30DaysProd,
  getJiraStories30Days,
  getResolvedJiraBugs30Days,
} from "~/data/jira.server";
import {
  getAutomatedTests,
  getManualTests,
  getPercentage,
  getTestCasesFromTestRail,
  getTestTypeTests,
} from "~/data/testrail.server";

import { db } from "~/data/config.server";
import { tests, InsertTests } from "~/data/schema.tests.server";
import { bugs, InsertBugs } from "~/data/schema.bugs.server";
import { DateTime } from "luxon";

async function getBugData() {
  const jiraDefects30Days = await getJiraBugs30Days();
  const jiraDefects30DaysProd = await getJiraBugs30DaysProd();
  const jiraDefects30DaysDev = await getJiraBugs30DaysDev();
  const jiraStories30Days = await getJiraStories30Days();

  const jiraDefectsResolved30Days = await getResolvedJiraBugs30Days();
  const defectResolutionTime = await getDefectResolutionTime(
    jiraDefectsResolved30Days.jiraData
  );

  const currentMonth = DateTime.now().monthShort;
  const currentYear = DateTime.now().year;

  const record: InsertBugs = {
    month: currentMonth,
    year: currentYear.toString(),
    total_bugs: jiraDefects30Days.totalJiraIssues,
    dev_bugs: jiraDefects30DaysDev.totalJiraIssues,
    prod_bugs: jiraDefects30DaysProd.totalJiraIssues,
    bug_resolution: defectResolutionTime,
    stories_resolved: jiraStories30Days.totalJiraIssues,
  };

  console.log("Bug Data", record);
  const recordId = db.insert(bugs).values(record).run().lastInsertRowid;
  console.log("Inserted Record Id", recordId);
}

async function getTestTypeData() {
  const testCaseData = await getTestCasesFromTestRail(0);

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

  const nonFunctionalTests = getTestTypeTests(testCaseData, 12);
  const nonFunctionalTestPercentage = getPercentage(
    nonFunctionalTests.length,
    totalTestCases
  );

  //   const record: InsertTests = {
  //     month: vals.month.toString(),
  //     year: vals.year.toString(),
  //     total_tests: parseInt(vals.total_tests.toString()),
  //   };
  //   db.insert(tests).values(record).run();
}

getBugData();

// getTestTypeData()
