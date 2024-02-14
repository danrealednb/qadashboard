import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import TestRunTestList from "~/components/TestRunTestList";
import {
  getTestsInTestRun,
  strippedDownTestRunData,
} from "~/data/testrail.server";

export default function TestRunResults() {
  const { testRunData } = useLoaderData<typeof loader>();
  const params = useParams();
  return (
    <>
      <Header testRailProjectId={params.id} />
      <h1 className="text-center text-2xl py-5 underline">Test Run Results</h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {testRunData.length}
      </h2>
      <TestRunTestList testCases={testRunData} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const runId = params.runId;
  const testRailProjectId = params.trId;
  //   const data = await getJiraBugs30Days();

  const data = await getTestsInTestRun(testRailProjectId, 0, runId!!);
  //   console.log(data);

  const testRunData = strippedDownTestRunData(data);

  return { testRunData };
}
