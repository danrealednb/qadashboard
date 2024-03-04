import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import TabContent from "~/components/TabContent";
import TestList from "~/components/TestList";
import {
  getJiraFeature,
  getJiraFeatureStories,
  getJiraFeatures,
} from "~/data/jira.server";
import {
  TEST_CASE,
  TEST_CASE_STR,
  TEST_COVERAGE,
  getAllTestCases,
  getJiraRefTestsV2,
  getTestCasesFromTestRail,
  getTestCasesFromTestRailV2,
  getTestTypeTests,
} from "~/data/testrail.server";

export default function FeatureCoverageStories() {
  const { epic, testCoverage, tcp, featureData } =
    useLoaderData<typeof loader>();
  const params = useParams();
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  return (
    <>
      <Header
        testRailProjectId={params.trId}
        jiraProjectId={params.jpId}
        fixVersionId={params.fv}
      />
      <h1 className="text-center text-2xl py-5 underline">
        {pageLoading && (
          <div className="flex justify-center items-center text-center text-yellow-500 text-3xl py-5">
            Feature Data Loading.....
          </div>
        )}
        <a
          href={`https://eyeota.atlassian.net/browse/${epic}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Feature Test Coverage For {epic}
        </a>
      </h1>
      <h2 className="text-center text-xl py-1">
        {featureData.issues[0].fields.summary}
      </h2>
      <h2 className="text-center py-2 px-20">
        {featureData.issues[0].fields.description}
      </h2>
      <h3 className="text-center text-2xl pb-5 font-extrabold text-blue-500">
        {tcp}%
      </h3>

      <ul className="grid justify-center space-y-2 px-4 pb-4 text-center text-pretty">
        {testCoverage.length === 0 && (
          <h4 className="text-purple-600 font-semibold">
            No Stories Linked to Feature
          </h4>
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
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const epic = params.id;
  const testRailProjectId = params.trId;
  const jiraProjectId = params.jpId;

  const jiraFeatureStoryData = await getJiraFeatureStories(
    jiraProjectId,
    epic!!
  );

  const testCases = await getTestCasesFromTestRailV2(testRailProjectId, 0);

  const testCoverage = getJiraRefTestsV2(
    jiraFeatureStoryData.jiraData,
    testCases
  );

  const testCoveragePercentage = () => {
    const stories = jiraFeatureStoryData.totalJiraIssues;
    const coverageCount = testCoverage.filter(
      (t: TEST_COVERAGE) => t.coverage
    ).length;

    const coveragePercentage = (coverageCount / stories) * 100;
    return coveragePercentage ? coveragePercentage : 0;
  };
  const tcp = testCoveragePercentage();

  const featureData = await getJiraFeature(jiraProjectId, epic!!);

  return { epic, testCoverage, tcp, featureData };
}
