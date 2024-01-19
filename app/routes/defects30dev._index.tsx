import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import JiraList from "~/components/JiraList";
import { getJiraBugs30DaysDev } from "~/data/jira.server";

export default function BugsDev() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">
        Defects Found In Last 30 Days in Dev/QA
      </h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {data.totalJiraIssues}
      </h2>
      <JiraList jiraData={data.jiraData} />
    </>
  );
}

export async function loader() {
  const data = await getJiraBugs30DaysDev();

  return { data };
}
