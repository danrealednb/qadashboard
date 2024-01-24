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
  getTestCasesFromTestRail,
  getTestTypeTests,
} from "~/data/testrail.server";

import { db } from "~/data/config.server";
import { tests, InsertTests } from "~/data/schema.tests.server";
import { bugs, InsertBugs } from "~/data/schema.bugs.server";
import { DateTime } from "luxon";

// const currentMonth = DateTime.now().monthShort;
// const currentYear = DateTime.now().year;

const currentMonth = DateTime.now().plus({ months: 5 }).monthShort;
const currentYear = DateTime.now().minus({ years: 1 }).year;

async function getBugData() {
  const jiraDefects30Days = await getJiraBugs30Days();
  const jiraDefects30DaysProd = await getJiraBugs30DaysProd();
  const jiraDefects30DaysDev = await getJiraBugs30DaysDev();
  const jiraStories30Days = await getJiraStories30Days();

  const jiraDefectsResolved30Days = await getResolvedJiraBugs30Days();
  const defectResolutionTime = await getDefectResolutionTime(
    jiraDefectsResolved30Days.jiraData
  );

  const record: InsertBugs = {
    month: currentMonth as InsertTests["month"],
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

  const manualTests = getManualTests(testCaseData);

  const accessibilityTests = getTestTypeTests(testCaseData, 1);

  const dataValidationTests = getTestTypeTests(testCaseData, 2);

  const e2eTests = getTestTypeTests(testCaseData, 3);

  const functionalTests = getTestTypeTests(testCaseData, 4);

  const integrationTests = getTestTypeTests(testCaseData, 5);

  const performanceTests = getTestTypeTests(testCaseData, 6);

  const loadTests = getTestTypeTests(testCaseData, 7);

  const regressionTests = getTestTypeTests(testCaseData, 8);

  const securityTests = getTestTypeTests(testCaseData, 9);

  const smokeTests = getTestTypeTests(testCaseData, 10);

  const unitTests = getTestTypeTests(testCaseData, 11);

  const nonFunctionalTests = getTestTypeTests(testCaseData, 12);
  const otherTests = getTestTypeTests(testCaseData, 13);

  const record: InsertTests = {
    month: currentMonth as InsertTests["month"],
    year: currentYear.toString(),
    total_tests: totalTestCases,
    automated_tests: automatedTests.length,
    manual_tests: manualTests.length,
    accessibility_tests: accessibilityTests.length,
    data_validation_tests: dataValidationTests.length,
    e2e_tests: e2eTests.length,
    functional_tests: functionalTests.length,
    integration_tests: integrationTests.length,
    performance_tests: performanceTests.length,
    load_tests: loadTests.length,
    regression_tests: regressionTests.length,
    security_tests: securityTests.length,
    smoke_tests: smokeTests.length,
    unit_tests: unitTests.length,
    non_functional_tests: nonFunctionalTests.length,
    other_tests: otherTests.length,
  };

  console.log("Test Data", record);
  const recordId = db.insert(tests).values(record).run().lastInsertRowid;
  console.log("Inserted Record Id", recordId);
}

getBugData();

getTestTypeData();
