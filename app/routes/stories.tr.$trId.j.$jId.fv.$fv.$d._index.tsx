import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import TabContent from "~/components/TabContent";
import TestList from "~/components/TestList";
import {
  getJiraFeature,
  getJiraFeatureStories,
  getJiraFeatures,
  getJiraStories30Days,
} from "~/data/jira.server";
import {
  TEST_CASE,
  TEST_CASE_STR,
  TEST_COVERAGE,
  getAllTestCases,
  getJiraRefTestsV3,
  getTestCasesFromTestRail,
  getTestCasesFromTestRailV2,
  getTestTypeTests,
} from "~/data/testrail.server";

export default function Stories() {
  const { testCoverage } = useLoaderData<typeof loader>();
  const params = useParams();
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const pageHeadingText =
    params.fv === "NA" || params.d === "t"
      ? "Stories And Bugs Resolved Last 30 Days"
      : `Stories And Bugs Resolved Release ${params.fv}`;
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
          Test Data Loading.....
        </div>
      )}
      <div className="flex justify-center text-center py-5 px-5 text-pretty">
        <ul className="grid justify-center space-y-2">
          {testCoverage.length === 0 && (
            <h4 className="text-purple-600 font-semibold">No Stories</h4>
          )}

          {testCoverage.length > 0 && (
            <>
              <div className="pb-5">
                <h4 className="text-blue-600 font-semibold py-1">
                  {" "}
                  Total Stories:
                  {testCoverage.filter((s) => s.issueType === "Story").length}
                </h4>
                <h4 className="text-purple-600 font-semibold py-1">
                  {" "}
                  Total Bugs:
                  {testCoverage.filter((s) => s.issueType === "Bug").length}
                </h4>
              </div>
            </>
          )}

          {testCoverage.map((story: TEST_COVERAGE) => {
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
                      <label htmlFor="" className="text-red-600 font-extrabold">
                        ({story.issueType})
                      </label>
                    </>
                  )}

                  {story.coverage && (
                    <label htmlFor="" className="text-green-600 font-semibold">
                      Covered
                    </label>
                  )}
                  {!story.coverage && (
                    <label htmlFor="" className="text-red-600 font-semibold">
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
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  // const epic = params.id;
  const jiraProject = params.jId;
  const testRailProject = params.trId;
  const fixVersion = params.fv;
  const show30Days = params.d === "t" ? "NA" : fixVersion;

  const jiraFeatureStoryData = await getJiraStories30Days(
    jiraProject,
    show30Days
  );

  const testCases = await getTestCasesFromTestRailV2(testRailProject, 0);

  const testCoverage = getJiraRefTestsV3(
    jiraFeatureStoryData.jiraData,
    testCases
  );

  return { testCoverage };
}
