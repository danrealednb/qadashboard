import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import OpenBugList from "~/components/OpenBugList";
import { getJiraBugs30Days, getJiraBugsOpened } from "~/data/jira.server";

export default function BugsOpen() {
  const { data } = useLoaderData<typeof loader>();
  const params = useParams();
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";

  return (
    <>
      <Header testRailProjectId={params.trId} jiraProjectId={params.jId} />
      <h1 className="text-center text-2xl py-5 underline">All Open Bugs</h1>
      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-500 text-3xl py-5">
          Data Loading.....
        </div>
      )}
      <OpenBugList
        jiraData={data.jiraData}
        totalIssues={data.totalJiraIssues}
      />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const jiraProjectId = params.jId;

  const data = await getJiraBugsOpened(jiraProjectId);

  return { data };
}
