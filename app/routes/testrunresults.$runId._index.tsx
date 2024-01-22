import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import TestRunTestList from "~/components/TestRunTestList";
import {
  getTestsInTestRun,
  strippedDownTestRunData,
} from "~/data/testrail.server";

export default function TestRunResults() {
  const { testRunData } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
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
  //   const data = await getJiraBugs30Days();

  const data = await getTestsInTestRun(0, runId!!);
  //   console.log(data);

  const testRunData = strippedDownTestRunData(data);

  return { testRunData };
}
