import axios from "axios";
import * as crypto from "crypto";
import * as https from "https";
import { DateTime } from "luxon";

export interface JIRA_ISSUE_DATA {
  key: string;
  title: string;
  startDate: string;
  completeDate: string;
  severity: string;
  issueLinks: Array<{ key: string; reason: string }> | null;
  issueType: string;
}

export interface JIRA_ISSUE_BUGS_OPEN {
  key: string;
  title: string;
  startDate: string;
  completeDate: string;
  severity: string;
  issueLinks: Array<{ key: string; reason: string }> | null;
  issueType: string;
  daysOpened: number;
}

export interface JIRA_ISSUE_STORY_DATA {
  key: string;
  title: string;
  issueType: string;
}

export interface JIRA_ISSUE_FEATURE_DATA {
  key: string;
  title: string;
  createdDate: string;
  resolutionDate: string;
}

export async function getJiraBugs30Days(
  jiraProject: string,
  fixVersion: string
) {
  const fixVersionIncluded =
    fixVersion === "NA" ? "%26created>=-30d" : `%26fixVersion="${fixVersion}"`;
  const query = `project=${jiraProject}%26issuetype=Bug${fixVersionIncluded}&fields=id.key,summary,created,resolutiondate,priority,issuelinks,issuetype&maxResults=100`;
  // console.log(query);
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_DATA = {
      key: element.key,
      title: element.fields.summary,
      startDate: element.fields.created,
      completeDate: element.fields.resolutiondate,
      severity: element.fields.priority.name,
      issueLinks: element.fields.issuelinks
        ? element.fields.issuelinks.map((il: any) => {
            return {
              key: il.inwardIssue ? il.inwardIssue.key : il.outwardIssue.key,
              reason: il.outwardIssue ? il.type.outward : il.type.inward,
            };
          })
        : null,
      issueType: element.fields.issuetype.name,
    };

    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraBugs30DaysProd(
  jiraProject: string,
  fixVersion: string
) {
  const fixVersionIncluded =
    fixVersion === "NA" ? "%26created>=-30d" : `%26fixVersion="${fixVersion}"`;
  const query = `project=${jiraProject}%26issuetype=Bug${fixVersionIncluded}%26"Environment[Dropdown]"=Prod&fields=id.key,summary,created,resolutiondate,priority,issuelinks,issuetype&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_DATA = {
      key: element.key,
      title: element.fields.summary,
      startDate: element.fields.created,
      completeDate: element.fields.resolutiondate,
      severity: element.fields.priority.name,
      issueLinks: element.fields.issuelinks
        ? element.fields.issuelinks.map((il: any) => {
            return {
              key: il.inwardIssue ? il.inwardIssue.key : il.outwardIssue.key,
              reason: il.outwardIssue ? il.type.outward : il.type.inward,
            };
          })
        : null,
      issueType: element.fields.issuetype.name,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}
export async function getJiraBugs30DaysDev(
  jiraProject: string,
  fixVersion: string
) {
  const fixVersionIncluded =
    fixVersion === "NA" ? "%26created>=-30d" : `%26fixVersion="${fixVersion}"`;
  const query = `project=${jiraProject}%26issuetype=Bug${fixVersionIncluded}%26"Environment[Dropdown]"=Dev&fields=id.key,summary,created,resolutiondate,priority,issuelinks,issuetype&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_DATA = {
      key: element.key,
      title: element.fields.summary,
      startDate: element.fields.created,
      completeDate: element.fields.resolutiondate,
      severity: element.fields.priority.name,
      issueLinks: element.fields.issuelinks
        ? element.fields.issuelinks.map((il: any) => {
            return {
              key: il.inwardIssue ? il.inwardIssue.key : il.outwardIssue.key,
              reason: il.outwardIssue ? il.type.outward : il.type.inward,
            };
          })
        : null,
      issueType: element.fields.issuetype.name,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraStories30Days(
  jiraProject: string,
  fixVersion: string
) {
  const fixVersionIncluded =
    fixVersion === "NA" ? "%26resolved>=-30d" : `%26fixVersion="${fixVersion}"`;
  const query = `project=${jiraProject}%26issuetype%20in(Story,Bug)${fixVersionIncluded}&fields=id.key,summary,issuelinks,issuetype&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_STORY_DATA = {
      key: element.key,
      title: element.fields.summary,
      issueType: element.fields.issuetype.name,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getResolvedJiraBugs30Days(
  jiraProject: string,
  fixVersion: string
) {
  const fixVersionIncluded =
    fixVersion === "NA" ? "%26resolved>=-30d" : `%26fixVersion="${fixVersion}"`;
  const query = `project=${jiraProject}%26issuetype=Bug${fixVersionIncluded}&fields=id.key,summary,created,resolutiondate,priority,issuelinks,issuetype&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_DATA = {
      key: element.key,
      title: element.fields.summary,
      startDate: element.fields.created,
      completeDate: element.fields.resolutiondate,
      severity: element.fields.priority.name,
      issueLinks: element.fields.issuelinks
        ? element.fields.issuelinks.map((il: any) => {
            return {
              key: il.inwardIssue ? il.inwardIssue.key : il.outwardIssue.key,
              reason: il.outwardIssue ? il.type.outward : il.type.inward,
            };
          })
        : null,
      issueType: element.fields.issuetype.name,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getDefectResolutionTime(
  jiraBugData: Array<JIRA_ISSUE_DATA>
) {
  let bugDays: Array<number> = [];
  if (jiraBugData.length > 0) {
    for (let index = 0; index < jiraBugData.length; index++) {
      const startDate = jiraBugData[index].startDate;
      const completeDateDate = jiraBugData[index].completeDate;

      const date1 = DateTime.fromISO(completeDateDate);
      const date2 = DateTime.fromISO(startDate);

      const diff = date1.diff(date2, "days");

      const diffObj = diff.toObject();

      bugDays.push(diffObj.days as number);
    }
    const average = bugDays.reduce((a, b) => a + b) / bugDays.length;
    return average;
  } else {
    return 0;
  }
}

export async function getTestCaseEffectiveness(
  thirtyDaysBugs: Promise<{ totalJiraIssues: number }>,
  totalTestsExecuted: Promise<number>
) {
  const { totalJiraIssues } = await thirtyDaysBugs;
  const tests = await totalTestsExecuted;
  const testCaseEffectiveness = ((totalJiraIssues / tests) * 100).toFixed(2);

  return testCaseEffectiveness;
}

export async function getDefectDensity(
  thirtyDaysBugs: Promise<{ totalJiraIssues: number }>,
  thirtyDaysStories: Promise<{ totalJiraIssues: number }>
) {
  const bugs = (await thirtyDaysBugs).totalJiraIssues;
  const stories = (await thirtyDaysStories).totalJiraIssues;
  if (bugs === 0 && stories === 0) {
    return "0";
  } else {
    const defectDensity = ((bugs / stories) * 100).toFixed(2);
    return defectDensity;
  }
}
export async function getDefectSeverityIndex(
  jiraDefects30Days: Promise<{
    totalJiraIssues: number;
    jiraData: JIRA_ISSUE_DATA[];
  }>
) {
  const bugs = (await jiraDefects30Days).jiraData;
  const bugsCount = (await jiraDefects30Days).totalJiraIssues;

  const criticalBugs = bugs.filter(
    (issue: JIRA_ISSUE_DATA) => issue.severity === "Critical"
  );
  const highBugs = bugs.filter(
    (issue: JIRA_ISSUE_DATA) => issue.severity === "High"
  );
  const mediumBugs = bugs.filter(
    (issue: JIRA_ISSUE_DATA) => issue.severity === "Medium"
  );
  const lowBugs = bugs.filter(
    (issue: JIRA_ISSUE_DATA) => issue.severity === "Low"
  );
  if (bugsCount === 0) {
    return "0";
  } else {
    const defectSeverityIndex = (
      (criticalBugs.length * 10 +
        highBugs.length * 5 +
        mediumBugs.length * 3 +
        lowBugs.length * 2) /
      bugsCount
    ).toFixed(2);
    return defectSeverityIndex;
  }
}
export async function getDefectSeverityIndexMonthly(jiraDefects30Days: {
  totalJiraIssues: number;
  jiraData: JIRA_ISSUE_DATA[];
}) {
  const bugs = (await jiraDefects30Days).jiraData;
  const bugsCount = (await jiraDefects30Days).totalJiraIssues;

  const criticalBugs = bugs.filter(
    (issue: JIRA_ISSUE_DATA) => issue.severity === "Critical"
  );
  const highBugs = bugs.filter(
    (issue: JIRA_ISSUE_DATA) => issue.severity === "High"
  );
  const mediumBugs = bugs.filter(
    (issue: JIRA_ISSUE_DATA) => issue.severity === "Medium"
  );
  const lowBugs = bugs.filter(
    (issue: JIRA_ISSUE_DATA) => issue.severity === "Low"
  );
  if (bugsCount === 0) {
    return 0;
  } else {
    const defectSeverityIndex = (
      (criticalBugs.length * 10 +
        highBugs.length * 5 +
        mediumBugs.length * 3 +
        lowBugs.length * 2) /
      bugsCount
    ).toFixed(2);
    return defectSeverityIndex;
  }
}

export async function getJiraDefectResolutionTime(
  thirtyDaysResolvedBugs: Promise<{ jiraData: Array<JIRA_ISSUE_DATA> }>
) {
  const { jiraData } = await thirtyDaysResolvedBugs;
  const defectResolutionTime = getDefectResolutionTime(jiraData);
  return defectResolutionTime;
}

export async function getJiraFeatures(
  jiraProject: string,
  status: "to do" | "in progress" | "done"
) {
  const query = `project=${jiraProject}%26issuetype=Epic%26status="${status}"&fields=id.key,summary,issuetype,resolutiondate,created&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_FEATURE_DATA = {
      key: element.key,
      title: element.fields.summary,
      createdDate: element.fields.created,
      resolutionDate: element.fields.resolutiondate,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraFeatureStories(jiraProject: string, epic: string) {
  const query = `project=${jiraProject}%26"Epic Link"=${epic}&fields=id.key,summary,issuetype,customfield_10010,priority,issuelinks,issuetype&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_DATA = {
      key: element.key,
      title: element.fields.summary,
      startDate: element.fields.created,
      completeDate: element.fields.resolutiondate,
      severity: element.fields.priority.name,
      issueLinks: element.fields.issuelinks
        ? element.fields.issuelinks.map((il: any) => {
            return {
              key: il.inwardIssue ? il.inwardIssue.key : il.outwardIssue.key,
              reason: il.outwardIssue ? il.type.outward : il.type.inward,
            };
          })
        : null,
      issueType: element.fields.issuetype.name,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraFeature(jiraProject: string, epic: string) {
  const query = `project=${jiraProject}%26issuetype=Epic%26issue=${epic}&fields=id.key,summary,issuetype,resolutiondate,created,description&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  return response.data;
}
export async function getJiraProjects() {
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/project`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });
  return response.data;
}

export async function getJiraBugsOpened(jiraProject: string) {
  const query = `project=${jiraProject}%26issuetype=Bug%26status%20not%20in%20(Done)&fields=id.key,summary,created,resolutiondate,priority,issuelinks,issuetype&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const startDate = element.fields.created;

    const date1 = DateTime.now();
    const date2 = DateTime.fromISO(startDate);

    const diff = date1.diff(date2, "days");

    const diffObj = diff.toObject();

    const obj: JIRA_ISSUE_BUGS_OPEN = {
      key: element.key,
      title: element.fields.summary,
      startDate: element.fields.created,
      completeDate: element.fields.resolutiondate,
      severity: element.fields.priority.name,
      issueLinks: element.fields.issuelinks
        ? element.fields.issuelinks.map((il: any) => {
            return {
              key: il.inwardIssue ? il.inwardIssue.key : il.outwardIssue.key,
              reason: il.outwardIssue ? il.type.outward : il.type.inward,
            };
          })
        : null,
      issueType: element.fields.issuetype.name,
      daysOpened: diffObj.days as number,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraFixVersions(jiraProjectId: string) {
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/project/${jiraProjectId}/versions`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const versions = response.data
    .filter((f: any) => f.archived === false)
    .map((fv: any) => {
      return {
        versionId: fv.id,
        versionName: fv.name,
        released: fv.released,
      };
    });
  return versions;
}

export async function getSprintVersions(jiraProjectId: string) {
  const getSprintData = async (jiraProjectId: string, offset: number = 0) => {
    const response = await axios({
      url: `https://${process.env.JIRA_INSTANCE}/rest/agile/1.0/board/${jiraProjectId}/sprint?startAt=${offset}`,
      maxBodyLength: Infinity,
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          process.env.JIRA_CREDENTIALS || "test"
        ).toString("base64")}`,
      },
      timeout: 60000,
      httpsAgent: new https.Agent({
        // for self signed
        rejectUnauthorized: false,
        // allow legacy server
        // need this because node 18+ removed legacy server which throws an error
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
      }),
      method: "GET",
    });

    const fullSprintData = response.data;
    return fullSprintData;
  };

  const getTotals = await getSprintData(jiraProjectId, 0);

  const numberOfLoops = Math.ceil(getTotals.total / 50);

  let offsets = 0;
  const allSprintData: any = [];
  for (let index = 0; index < numberOfLoops; index++) {
    const offsetSprintData = await getSprintData(jiraProjectId, offsets);
    allSprintData.push(...offsetSprintData.values);
    offsets += 50;
  }
  allSprintData.sort((a: any, b: any) =>
    b.id > a.id ? 1 : a.id > b.id ? -1 : 0
  );
  return allSprintData;
}

export async function getJiraProjectIdByKey(jiraProjectId: string) {
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/agile/1.0/board`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const project = response.data.values.filter(
    (board: any) => board.location.projectKey === jiraProjectId
  );

  const projectId = project[0].id;
  return projectId;
}

export enum TEST_ENVIRONMENT {
  DEV = "Dev",
  QA = "QA",
  STAGING = "Staging",
  PROD = "Prod",
  NA = "NA",
}

export async function getJiraBugsFromSprint(
  jiraProject: string,
  sprintStartDate: string,
  sprintEndDate: string,
  environment: TEST_ENVIRONMENT
) {
  // const fixVersionIncluded =
  //   fixVersion === "NA" ? "%26created>=-30d" : `%26sprint="${fixVersion}"`;
  // created >= 2024-02-01 AND created <= 2024-03-03
  const sprintDates = `%26created>=${sprintStartDate}%26created<=${sprintEndDate}`;
  const test_env =
    environment === TEST_ENVIRONMENT.NA
      ? ""
      : `%26"Environment[Dropdown]"=${environment}`;
  // want to get bugs found and resolved between these dates
  const query = `project=${jiraProject}%26issuetype=Bug%26${sprintDates}${test_env}&fields=id.key,summary,created,resolutiondate,priority,issuelinks,issuetype&maxResults=100`;
  // console.log(query);
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_DATA = {
      key: element.key,
      title: element.fields.summary,
      startDate: element.fields.created,
      completeDate: element.fields.resolutiondate,
      severity: element.fields.priority.name,
      issueLinks: element.fields.issuelinks
        ? element.fields.issuelinks.map((il: any) => {
            return {
              key: il.inwardIssue ? il.inwardIssue.key : il.outwardIssue.key,
              reason: il.outwardIssue ? il.type.outward : il.type.inward,
            };
          })
        : null,
      issueType: element.fields.issuetype.name,
    };

    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraStoriesFromSprint(
  jiraProject: string,
  sprintId: string
) {
  const query = `project=${jiraProject}%26issuetype%20in(Story)%26sprint=${sprintId}&fields=id.key,summary,issuelinks,issuetype&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_STORY_DATA = {
      key: element.key,
      title: element.fields.summary,
      issueType: element.fields.issuetype.name,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}
export async function getJiraStoriesBugsFromSprint(
  jiraProject: string,
  sprintId: string
) {
  const query = `project=${jiraProject}%26issuetype%20in(Story,Bug)%26sprint=${sprintId}&fields=id.key,summary,issuelinks,issuetype&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_STORY_DATA = {
      key: element.key,
      title: element.fields.summary,
      issueType: element.fields.issuetype.name,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getResolvedJiraBugsSprint(
  jiraProject: string,
  sprintId: string
) {
  const query = `project=${jiraProject}%26issuetype=Bug%26sprint=${sprintId}%26status=Done&fields=id.key,summary,created,resolutiondate,priority,issuelinks,issuetype&maxResults=100`;
  const response = await axios({
    url: `https://${process.env.JIRA_INSTANCE}/rest/api/2/search?jql=${query}`,
    maxBodyLength: Infinity,
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        process.env.JIRA_CREDENTIALS || "test"
      ).toString("base64")}`,
    },
    timeout: 60000,
    httpsAgent: new https.Agent({
      // for self signed
      rejectUnauthorized: false,
      // allow legacy server
      // need this because node 18+ removed legacy server which throws an error
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
    method: "GET",
  });

  const totalJiraIssues: number = response.data.total;

  let jiraData = [];

  for (let index = 0; index < response.data.issues.length; index++) {
    const element = response.data.issues[index];

    const obj: JIRA_ISSUE_DATA = {
      key: element.key,
      title: element.fields.summary,
      startDate: element.fields.created,
      completeDate: element.fields.resolutiondate,
      severity: element.fields.priority.name,
      issueLinks: element.fields.issuelinks
        ? element.fields.issuelinks.map((il: any) => {
            return {
              key: il.inwardIssue ? il.inwardIssue.key : il.outwardIssue.key,
              reason: il.outwardIssue ? il.type.outward : il.type.inward,
            };
          })
        : null,
      issueType: element.fields.issuetype.name,
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}
