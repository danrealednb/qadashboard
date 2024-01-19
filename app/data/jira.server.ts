import axios from "axios";
import * as crypto from "crypto";
import * as https from "https";

export interface JIRA_ISSUE_DATA {
  key: string;
  title: string;
}

export async function getJiraBugs30Days() {
  const query = `project=PLAT%26issuetype=Bug%26created>=-30d&fields=id.key,summary&maxResults=100`;
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
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}

export async function getJiraBugs30DaysProd() {
  const query = `project=PLAT%26issuetype=Bug%26created>=-30d%26"Environment[Dropdown]"=Prod&fields=id.key,summary&maxResults=100`;
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
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}
export async function getJiraBugs30DaysDev() {
  const query = `project=PLAT%26issuetype=Bug%26created>=-30d%26"Environment[Dropdown]"=Dev&fields=id.key,summary&maxResults=100`;
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
    };
    jiraData.push(obj);
  }

  return { totalJiraIssues, jiraData };
}
