import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import JiraList from "~/components/JiraList";
import { getJiraBugs30Days } from "~/data/jira.server";

export default function DefectSeverityIndex() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">
        Defect Severity Index
      </h1>
      <JiraList jiraData={data.jiraData} totalIssues={data.totalJiraIssues} />
    </>
  );
}

export async function loader() {
  const data = await getJiraBugs30Days();

  return { data };
}
