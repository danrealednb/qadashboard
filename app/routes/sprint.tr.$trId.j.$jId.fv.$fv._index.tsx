import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
import Header from "~/components/Header";
import {
  TEST_ENVIRONMENT,
  getDefectDensity,
  getDefectSeverityIndex,
  getJiraBugsFromSprint,
  getJiraDefectResolutionTime,
  getJiraProjectIdByKey,
  getJiraStoriesBugsFromSprint,
  getJiraStoriesFromSprint,
  getResolvedJiraBugsSprint,
  getSprintVersions,
  getTestCaseEffectiveness,
} from "~/data/jira.server";

import { DateTime } from "luxon";
import JiraList from "~/components/JiraList";
import {
  TEST_CASE_STR,
  TEST_COVERAGE,
  getCurrentTestRuns,
  getJiraRefTestsV3,
  getTestCasesFromTestRailV2,
  getTotalTestsExecuted,
} from "~/data/testrail.server";

export default function SprintPage() {
  const { sprintData } = useLoaderData<typeof loader>();
  const params = useParams();
  const data = useActionData<typeof action>();
  const [sprintDates, setSprintDates] = useState({
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  });
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";

  const handleSprintDates = (e: any) => {
    const sprintVal = e.target.value;
    const sprintObj = sprintData.filter(
      (sprint: any) => sprint.id == sprintVal
    );
    const startDate = DateTime.fromISO(sprintObj[0].startDate)
      .setZone("America/New_York")
      .toFormat("yyyy-MM-dd");
    const endDate = DateTime.fromISO(sprintObj[0].endDate)
      .setZone("America/New_York")
      .toFormat("yyyy-MM-dd");
    setSprintDates({ startDate, endDate });
  };

  return (
    <>
      <Header
        testRailProjectId={params.trId}
        jiraProjectId={params.jId}
        fixVersionId={params.fv}
      />
      <h1 className="text-center text-2xl py-5 underline">Sprints</h1>

      <div className="grid justify-center items-center text-center pt-2">
        <Form
          method="POST"
          className="grid justify-center items-center text-center space-y-5"
        >
          <select
            name="sprint"
            id="sprint"
            data-testid="sprint"
            className="border-blue-600 border-2 rounded-full px-2 py-1"
            onChange={handleSprintDates}
          >
            {sprintData.map((sprint: any) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name} ({sprint.state})
              </option>
            ))}
          </select>

          <input type="hidden" name="startDate" value={sprintDates.startDate} />
          <input type="hidden" name="endDate" value={sprintDates.endDate} />

          <button
            type="submit"
            value="Submit"
            className="border-4 border-red-600 rounded-full px-2 py-1"
          >
            View Sprint Data
          </button>
        </Form>
      </div>

      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-500 text-3xl py-5">
          Sprint Data Loading.....
        </div>
      )}

      <div className="py-5">
        <h2 className="text-center text-2xl font-semibold py-2 underline">
          Total Sprint Bugs
        </h2>
        {data && (
          <JiraList
            jiraData={data?.totalSprintBugs?.jiraData}
            totalIssues={data?.totalSprintBugs?.totalJiraIssues}
          />
        )}

        <h2 className="text-center text-2xl font-semibold py-2 underline">
          Dev Sprint Bugs
        </h2>
        {data && (
          <JiraList
            jiraData={data?.devSprintBugs?.jiraData}
            totalIssues={data?.devSprintBugs?.totalJiraIssues}
          />
        )}

        <h2 className="text-center text-2xl font-semibold py-2 underline">
          Prod Sprint Bugs
        </h2>
        {data && (
          <JiraList
            jiraData={data?.prodSprintBugs?.jiraData}
            totalIssues={data?.prodSprintBugs?.totalJiraIssues}
          />
        )}

        <h2 className="text-center text-2xl font-semibold py-2 underline">
          Defect Severity Index
        </h2>
        <h3 className="text-center italic">
          (Weighted average of bugs by severity)
        </h3>
        {data?.defectSeverityIndex < 2.5 && (
          <p className="text-3xl font-extrabold text-center text-green-500">
            {data?.defectSeverityIndex}
          </p>
        )}
        {data?.defectSeverityIndex > 2.5 && (
          <p className="text-3xl font-extrabold text-center text-red-500">
            {data?.defectSeverityIndex}
          </p>
        )}

        <h2 className="text-center text-2xl font-semibold py-2 underline">
          Defect Density
        </h2>
        <h3 className="text-center italic">
          (Number of defects divided by number of stories)
        </h3>
        <p className="text-3xl font-extrabold text-center text-blue-500">
          {data?.defectDensity}
        </p>

        <h2 className="text-center text-2xl font-semibold py-2 underline">
          Defect Resolution Time
        </h2>
        <h3 className="text-center italic">
          (Average number of days taken to fix resolved bugs)
        </h3>
        <p className="text-3xl font-extrabold text-center text-blue-500">
          {data?.defectResoltionTimeFormatted}
        </p>

        <h2 className="text-center text-2xl font-semibold py-2 underline">
          Resolved Stories + Bugs
        </h2>
        {data?.jiraStoriesBugsFromSprint && (
          <div className="flex justify-center text-center py-5 px-5 text-pretty">
            <ul className="grid justify-center space-y-2">
              {data.testCoverage.length === 0 && (
                <h4 className="text-purple-600 font-semibold">No Stories</h4>
              )}

              {data.testCoverage.length > 0 && (
                <>
                  <div className="pb-5">
                    <h4 className="text-blue-600 font-semibold py-1">
                      {" "}
                      Total Stories:
                      {
                        data.testCoverage.filter((s) => s.issueType === "Story")
                          .length
                      }
                    </h4>
                    <h4 className="text-purple-600 font-semibold py-1">
                      {" "}
                      Total Bugs:
                      {
                        data.testCoverage.filter((s) => s.issueType === "Bug")
                          .length
                      }
                    </h4>
                  </div>
                </>
              )}

              {data.testCoverage.map((story: TEST_COVERAGE) => {
                return (
                  <>
                    <li key={story.key} className="space-x-2">
                      {story.issueType === "Story" && (
                        <>
                          <label htmlFor="" className="font-semibold">
                            {story.key} {story.title}
                          </label>
                        </>
                      )}

                      {story.issueType === "Bug" && (
                        <>
                          <label htmlFor="" className="font-semibold">
                            {story.key} {story.title}
                          </label>
                          <label
                            htmlFor=""
                            className="text-red-600 font-extrabold"
                          >
                            ({story.issueType})
                          </label>
                        </>
                      )}

                      {story.coverage && (
                        <label
                          htmlFor=""
                          className="text-green-600 font-semibold"
                        >
                          Covered
                        </label>
                      )}
                      {!story.coverage && (
                        <label
                          htmlFor=""
                          className="text-red-600 font-semibold"
                        >
                          NO COVERAGE
                        </label>
                      )}
                    </li>
                    <li>
                      {story.coverage && (
                        <ul className="px-4 justify-center">
                          {story.tests?.map((test: TEST_CASE_STR) => (
                            <li className="space-x-2">
                              <label htmlFor="">{test.title}</label>

                              {test.custom_automated_test === 1 && (
                                <label
                                  htmlFor=""
                                  className="text-blue-600 font-semibold"
                                >
                                  (Automated)
                                </label>
                              )}
                              {test.custom_automated_test === 0 && (
                                <label
                                  htmlFor=""
                                  className="text-blue-600 font-semibold"
                                >
                                  (Manual)
                                </label>
                              )}
                              {test.custom_test_case_type && (
                                <label htmlFor="" className="text-purple-600">
                                  {test.custom_test_case_type}
                                </label>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  // const url = new URL(request.url);
  // const search = new URLSearchParams(url.search);

  // const sprint = search.get("sprint") || "433";

  // search.set("sprint", sprint);

  //   const testRailId = search.get("testRailProject") || "4";

  //   search.set("testRailProject", testRailId);

  //   const testRailProjects = await getTestRailProjects();

  //   const jiraProjects = await getJiraProjects();

  //   // console.log("Selected Jira Project", jiraProjectId);

  const jiraProjectId = await getJiraProjectIdByKey(params.jId!!);
  // console.log(jiraProjectId);

  // const sprintD = await getSprintVersions(jiraProjectId, 0);
  // console.log("sprintd", sprintD);

  const sprintData = await getSprintVersions(jiraProjectId);
  // console.log("sprint data", sprintData);

  // return defer({
  //   jiraProjects,
  //   testRailProjects,
  // });

  //   return {
  //     jiraProjects,
  //     testRailProjects,
  //     releaseVersions,
  //   };
  // const sprintData = [
  //   { id: 1, key: 1, name: 1 },
  //   { id: 2, key: 2, name: 2 },
  // ];
  // return null;
  // const sprintData = ["1"];
  return { sprintData };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const selectedTestRailProject = params.trId;
  const selectedJiraProject = params.jId;
  const fixVersion = params.fv;

  const formData = await request.formData();
  const vals = Object.fromEntries(formData);
  // console.log("VALS", vals);

  // return redirect(
  //   `/dashboard/tr/${vals.testRailProject.toString()}/j/${vals.jiraProject.toString()}/fv/${vals.fixVersion.toString()}`
  // );

  const dan = [1, 2, 3, 4, 5];
  const steve = [6, 7, 8, 9, 10];
  const joe = [11, 12, 13, 14, 15];

  const totalSprintBugs = await getJiraBugsFromSprint(
    selectedJiraProject,
    vals.startDate.toString(),
    vals.endDate.toString(),
    TEST_ENVIRONMENT.NA
  );
  // console.log("Total spriont bugs", totalSprintBugs);
  const devSprintBugs = await getJiraBugsFromSprint(
    selectedJiraProject,
    vals.startDate.toString(),
    vals.endDate.toString(),
    TEST_ENVIRONMENT.DEV
  );
  const prodSprintBugs = await getJiraBugsFromSprint(
    selectedJiraProject,
    vals.startDate.toString(),
    vals.endDate.toString(),
    TEST_ENVIRONMENT.PROD
  );

  const defectSeverityIndex = await getDefectSeverityIndex(totalSprintBugs);

  const jiraStoriesFromSprint = await getJiraStoriesFromSprint(
    selectedJiraProject,
    vals.sprint.toString()
  );

  const jiraStoriesBugsFromSprint = await getJiraStoriesBugsFromSprint(
    selectedJiraProject,
    vals.sprint.toString()
  );
  const defectDensity = await getDefectDensity(
    totalSprintBugs,
    jiraStoriesFromSprint
  );

  const jiraDefectsResolvedSprint = await getResolvedJiraBugsSprint(
    selectedJiraProject,
    vals.sprint.toString()
  );
  const defectResolutionTime = await getJiraDefectResolutionTime(
    jiraDefectsResolvedSprint
  );

  const defectResoltionTimeFormatted =
    parseFloat(defectResolutionTime.toFixed(2)) || 0;

  // resolved stories/ bugs

  const testCases = await getTestCasesFromTestRailV2(
    selectedTestRailProject,
    0
  );

  const testCoverage = getJiraRefTestsV3(
    jiraStoriesBugsFromSprint.jiraData,
    testCases
  );

  // tce
  const testRuns = await getCurrentTestRuns(selectedTestRailProject);

  const totalTestsExecuted = await getTotalTestsExecuted(testRuns);
  const testCaseEffectiveness = await getTestCaseEffectiveness(
    totalSprintBugs,
    totalTestsExecuted
  );
  // console.log("test case effectiveness", testCaseEffectiveness);

  return {
    totalSprintBugs,
    devSprintBugs,
    prodSprintBugs,
    defectSeverityIndex,
    defectDensity,
    defectResoltionTimeFormatted,
    jiraStoriesBugsFromSprint,
    testCoverage,
  };
}
