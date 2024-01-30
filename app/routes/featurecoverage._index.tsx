import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import TabContent from "~/components/TabContent";
import { getJiraFeatures } from "~/data/jira.server";

export default function Tests() {
  const { tabData } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">Feature Coverage</h1>
      <div className="flex justify-center">
        <TabContent data={tabData} />
      </div>
    </>
  );
}

export async function loader() {
  const jiraFeaturesToDo = await getJiraFeatures("to do");
  const jiraFeaturesInProgress = await getJiraFeatures("in progress");
  const jiraFeaturesDone = await getJiraFeatures("done");

  const tabData = {
    "To Do": [...jiraFeaturesToDo.jiraData],
    "In Progress": [...jiraFeaturesInProgress.jiraData],
    Done: [...jiraFeaturesDone.jiraData],
  };
  return { tabData };
}
