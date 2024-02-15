import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import JiraList from "~/components/JiraList";
import { getJiraBugs30DaysProd } from "~/data/jira.server";

export default function BugsProd() {
  const { data } = useLoaderData<typeof loader>();
  const params = useParams();
  return (
    <>
      <Header testRailProjectId={params.trId} jiraProjectId={params.jId} />
      <h1 className="text-center text-2xl py-5 underline">
        Defects Found In Last 30 Days in Production (Defect Leakage)
      </h1>
      <JiraList jiraData={data.jiraData} totalIssues={data.totalJiraIssues} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const jiraProjectId = params.jId;
  const data = await getJiraBugs30DaysProd(jiraProjectId);

  return { data };
}
