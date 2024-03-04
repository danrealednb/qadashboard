import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import JiraList from "~/components/JiraList";
import { getJiraBugs30Days } from "~/data/jira.server";

export default function Bugs() {
  const { data } = useLoaderData<typeof loader>();
  const params = useParams();
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const pageHeadingText =
    params.fv === "NA" || params.d === "t"
      ? "Defects Found In Last 30 Days"
      : `Defects Found In Release ${params.fv}`;

  return (
    <>
      <Header
        testRailProjectId={params.trId}
        jiraProjectId={params.jId}
        fixVersionId={params.fv}
      />
      <h1 className="text-center text-2xl py-5 underline">{pageHeadingText}</h1>
      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-500 text-3xl py-5">
          Data Loading.....
        </div>
      )}
      <JiraList jiraData={data.jiraData} totalIssues={data.totalJiraIssues} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const jiraProjectId = params.jId;
  const fixVersion = params.fv;
  const show30Days = params.d === "t" ? "NA" : fixVersion;
  const data = await getJiraBugs30Days(jiraProjectId, show30Days);

  return { data };
}
