import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import TabContent from "~/components/TabContent";
import { getJiraFeatures } from "~/data/jira.server";

export default function Tests() {
  const { tabData } = useLoaderData<typeof loader>();
  const params = useParams();
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  return (
    <>
      <Header testRailProjectId={params.trId} jiraProjectId={params.jId} />
      <h1 className="text-center text-2xl py-5 underline">Feature Coverage</h1>
      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-500 text-3xl py-5">
          Feature Data Loading.....
        </div>
      )}
      <div className="flex justify-center">
        <TabContent
          data={tabData}
          jiraProjectId={params.jId}
          testRailProjectId={params.trId}
        />
      </div>
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const jiraProjectId = params.jId;
  const jiraFeaturesToDo = await getJiraFeatures(jiraProjectId, "to do");
  const jiraFeaturesInProgress = await getJiraFeatures(
    jiraProjectId,
    "in progress"
  );
  const jiraFeaturesDone = await getJiraFeatures(jiraProjectId, "done");

  const tabData = {
    "To Do": [...jiraFeaturesToDo.jiraData],
    "In Progress": [...jiraFeaturesInProgress.jiraData],
    Done: [...jiraFeaturesDone.jiraData],
  };
  return { tabData };
}
