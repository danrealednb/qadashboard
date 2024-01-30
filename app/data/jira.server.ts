import axios from "axios";
import * as crypto from "crypto";
import * as https from "https";
import { DateTime } from "luxon";

export interface JIRA_ISSUE_DATA {
  key: string;
  title: string;
  startDate: string;
  completeDate: string;
}

export interface JIRA_ISSUE_STORY_DATA {
  key: string;
  title: string;
}

export interface JIRA_ISSUE_FEATURE_DATA {
  key: string;
  title: string;
  createdDate: string;
  resolutionDate: string;
}

export async function getJiraBugs30Days() {
  const query = `project=PLAT%26issuetype=Bug%26created>=-30d&fields=id.key,summary,created,resolutiondate&maxResults=100`;
  const response = await axios({
    url: `https://eyeota.atlassian.net/rest/api/2/search?jql=${query}`,
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
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraBugs30DaysProd() {
  const query = `project=PLAT%26issuetype=Bug%26created>=-30d%26"Environment[Dropdown]"=Prod&fields=id.key,summary,created,resolutiondate&maxResults=100`;
  const response = await axios({
    url: `https://eyeota.atlassian.net/rest/api/2/search?jql=${query}`,
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
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}
export async function getJiraBugs30DaysDev() {
  const query = `project=PLAT%26issuetype=Bug%26created>=-30d%26"Environment[Dropdown]"=Dev&fields=id.key,summary,created,resolutiondate&maxResults=100`;
  const response = await axios({
    url: `https://eyeota.atlassian.net/rest/api/2/search?jql=${query}`,
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
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraStories30Days() {
  const query = `project=PLAT%26issuetype=Story%26resolved>=-30d&fields=id.key,summary&maxResults=100`;
  const response = await axios({
    url: `https://eyeota.atlassian.net/rest/api/2/search?jql=${query}`,
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
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getResolvedJiraBugs30Days() {
  const query = `project=PLAT%26issuetype=Bug%26resolved>=-30d&fields=id.key,summary,created,resolutiondate&maxResults=100`;
  const response = await axios({
    url: `https://eyeota.atlassian.net/rest/api/2/search?jql=${query}`,
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
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getDefectResolutionTime(
  jiraBugData: Array<JIRA_ISSUE_DATA>
) {
  let bugDays: Array<number> = [];
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
  const defectDensity = ((bugs / stories) * 100).toFixed(2);
  return defectDensity;
}

export async function getJiraDefectResolutionTime(
  thirtyDaysResolvedBugs: Promise<{ jiraData: Array<JIRA_ISSUE_DATA> }>
) {
  const { jiraData } = await thirtyDaysResolvedBugs;
  const defectResolutionTime = getDefectResolutionTime(jiraData);
  return defectResolutionTime;
}

export async function getJiraFeatures(
  status: "to do" | "in progress" | "done"
) {
  const query = `project=PLAT%26issuetype=Epic%26status="${status}"&fields=id.key,summary,issuetype,resolutiondate,created&maxResults=100`;
  const response = await axios({
    url: `https://eyeota.atlassian.net/rest/api/2/search?jql=${query}`,
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

export async function getJiraFeatureStories(epic: string) {
  const query = `project=PLAT%26"Epic Link"=${epic}&fields=id.key,summary,issuetype,customfield_10010&maxResults=100`;
  const response = await axios({
    url: `https://eyeota.atlassian.net/rest/api/2/search?jql=${query}`,
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
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraFeature(epic: string) {
  const query = `project=PLAT%26issuetype=Epic%26issue=${epic}&fields=id.key,summary,issuetype,resolutiondate,created,description&maxResults=100`;
  const response = await axios({
    url: `https://eyeota.atlassian.net/rest/api/2/search?jql=${query}`,
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
