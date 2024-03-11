import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import TestRunTestList from "~/components/TestRunTestList";
import {
  getTestsInTestRun,
  strippedDownTestRunData,
} from "~/data/testrail.server";

export default function TestRunResults() {
  const { testRunData, counts } = useLoaderData<typeof loader>();
  const params = useParams();
  return (
    <>
      <Header
        testRailProjectId={params.trId}
        jiraProjectId={params.jId}
        fixVersionId={params.fv}
      />
      <h1 className="text-center text-2xl py-5 underline">Test Run Results</h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {testRunData.length}
      </h2>
      <TestRunTestList testCases={testRunData} counts={counts} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const runId = params.runId;
  const testRailProjectId = params.trId;
  //   const data = await getJiraBugs30Days();

  const data = await getTestsInTestRun(testRailProjectId, 0, runId!!);

  const testRunData = strippedDownTestRunData(data);

  const counts = {
    passed: testRunData.filter((run) => run.status === "Passed").length,
    failed: testRunData.filter((run) => run.status === "Failed").length,
    blocked: testRunData.filter((run) => run.status === "Blocked").length,
    retest: testRunData.filter((run) => run.status === "Retest").length,
    untested: testRunData.filter((run) => run.status === "Untested").length,
  };

  return { testRunData, counts };
}
