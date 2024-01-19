import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import JiraList from "~/components/JiraList";
import { getJiraBugs30DaysProd } from "~/data/jira.server";

export default function BugsProd() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">
        Defects Found In Last 30 Days in Production (Defect Leakage)
      </h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {data.totalJiraIssues}
      </h2>
      <JiraList jiraData={data.jiraData} />
    </>
  );
}

export async function loader() {
  const data = await getJiraBugs30DaysProd();

  return { data };
}