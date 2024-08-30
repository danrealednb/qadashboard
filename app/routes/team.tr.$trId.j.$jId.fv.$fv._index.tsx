import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { DateTime } from "luxon";
import { useState } from "react";
import CountPercentageVisual from "~/components/CountPercentageVisual";
import CountVisual from "~/components/CountVisual";
import Header from "~/components/Header";
import JiraPointsList from "~/components/JiraPointsList";
import {
  getJiraProjectIdByKey,
  getSprintTeamData,
  getSprintVersions,
} from "~/data/jira.server";
import {
  getAllTestCases,
  getAutomatedTests,
  getManualTests,
  getPercentage,
  getTestCasesFromTestRail,
  getTestTypeTests,
} from "~/data/testrail.server";

export default function Team() {
  const { sprintData } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  const params = useParams();
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const [sprintDates, setSprintDates] = useState({
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  });

  return (
    <>
      <Header
        testRailProjectId={params.trId}
        jiraProjectId={params.jId}
        fixVersionId={params.fv}
      />
      <h1 className="text-center text-2xl py-5 underline">Team Breakdown</h1>

      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-500 text-3xl py-5">
          Test Data Loading.....
        </div>
      )}

      <div className="grid justify-center items-center text-center pt-2">
        <Form
          method="POST"
          className="grid justify-center items-center text-center space-y-5"
        >
          <label htmlFor="" className="font-bold">
            Jira Sprint
          </label>
          <select
            name="sprint"
            id="sprint"
            data-testid="sprint"
            className="border-blue-600 border-2 rounded-full px-2 py-1"
          >
            {sprintData.map((sprint: any) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name} ({sprint.state})
              </option>
            ))}
          </select>

          <div className="py-5">
            <button
              type="submit"
              value="Submit"
              className="border-4 border-red-600 rounded-full px-2 py-1"
            >
              View Sprint Data
            </button>
          </div>
        </Form>
      </div>

      {data && (
        <>
          <div className="grid justify-center text-center space-y-2">
            <h3 className="text-2xl">
              Total Jira Issues:{" "}
              <span className="text-blue-600 font-bold">
                {data?.totalJiraIssues}
              </span>
            </h3>
            <h3 className="text-2xl">
              Total Story Points:{" "}
              <span className="text-blue-600 font-bold">
                {data?.totalStoryPoints}
              </span>
            </h3>
            <h3 className="text-2xl">
              Total QA Points:{" "}
              <span className="text-blue-600 font-bold">
                {data?.totalQAPoints}
              </span>
            </h3>
          </div>

          <div className="flex justify-center text-center py-5">
            <ul className="space-y-2">
              {data?.teamPoints?.map((member) => (
                <>
                  <li className="grid justify-center text-center">
                    <span className="font-bold text-lg">{member.person}</span>
                    <div className="grid justify-center text-center">
                      <span>Dev Points: {member.story_points}</span>
                      <span>QA Points: {member.qa_points}</span>
                    </div>
                  </li>
                </>
              ))}
            </ul>
          </div>
          <JiraPointsList jiraData={data.jiraData} />
        </>
      )}
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  //   const testRailProjectId = params.trId;

  const jiraProjectId = await getJiraProjectIdByKey(params.jId!!);
  const sprintData = await getSprintVersions(jiraProjectId);

  return {
    sprintData,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const selectedJiraProject = params.jId;

  const formData = await request.formData();
  const vals = Object.fromEntries(formData);

  const teamData = await getSprintTeamData(
    selectedJiraProject!!,
    vals.sprint.toString()
  );
  return teamData;
}
