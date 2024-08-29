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
          <span className="text-blue-600 font-bold">{data?.totalQAPoints}</span>
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

      <div className="grid grid-cols-3 py-10 border-2 border-t-8">
        {/* <CountVisual chartName="Dan" count={totalTestCases} />
        <CountVisual chartName="Jimmy" count={totalTestCases} />
        <CountVisual chartName="Total Tests" count={totalTestCases} />
        <CountPercentageVisual
          chartName="Automated Tests"
          count={automatedTests.count}
          percentage={automatedTests.percentage}
          page={`/automatedtests/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Manual Tests"
          count={manualTests.count}
          percentage={manualTests.percentage}
          page={`/manualtests/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
      </div>
      <div className="grid grid-cols-4 py-10 border-2 gap-12 border-b-8">
        <CountPercentageVisual
          chartName="Accessibility Tests"
          count={accessibilityTests.count}
          percentage={accessibilityTests.percentage}
          page={`/tests/1/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Data Validation Tests"
          count={dataValidationTests.count}
          percentage={dataValidationTests.percentage}
          page={`/tests/2/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="E2E Tests"
          count={e2eTests.count}
          percentage={e2eTests.percentage}
          page={`/tests/3/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Functional Tests"
          count={functionalTests.count}
          percentage={functionalTests.percentage}
          page={`/tests/4/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Integration Tests"
          count={integrationTests.count}
          percentage={integrationTests.percentage}
          page={`/tests/5/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Performance Tests"
          count={performanceTests.count}
          percentage={performanceTests.percentage}
          page={`/tests/6/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Load Tests"
          count={loadTests.count}
          percentage={loadTests.percentage}
          page={`/tests/7/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Regression Tests"
          count={regressionTests.count}
          percentage={regressionTests.percentage}
          page={`/tests/8/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Security Tests"
          count={securityTests.count}
          percentage={securityTests.percentage}
          page={`/tests/9/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Smoke Tests"
          count={smokeTests.count}
          percentage={smokeTests.percentage}
          page={`/tests/10/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Unit Tests"
          count={unitTests.count}
          percentage={unitTests.percentage}
          page={`/tests/11/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Non-Functional Tests"
          count={nonFunctionalTests.count}
          percentage={nonFunctionalTests.percentage}
          page={`/tests/12/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        />
        <CountPercentageVisual
          chartName="Other Tests"
          count={otherTests.count}
          percentage={otherTests.percentage}
          page={`/tests/13/tr/${params.trId}/j/${params.jId}/fv/${params.fv}`}
        /> */}
      </div>
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

  console.log(vals);

  const teamData = await getSprintTeamData(
    selectedJiraProject!!,
    vals.sprint.toString()
  );
  //   console.log("TD", teamData);
  return teamData;
}
