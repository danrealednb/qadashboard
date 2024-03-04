import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import TestList from "~/components/TestList";
import {
  getAllTestCases,
  getManualTests,
  getTestCasesFromTestRail,
} from "~/data/testrail.server";

export default function ManualTests() {
  const { manualTests } = useLoaderData<typeof loader>();
  const params = useParams();
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  return (
    <>
      <Header
        testRailProjectId={params.trId}
        jiraProjectId={params.jId}
        fixVersionId={params.fv}
      />
      <h1 className="text-center text-2xl py-5 underline">Manual Tests</h1>
      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-500 text-3xl py-5">
          Test Data Loading.....
        </div>
      )}
      {manualTests.length > 0 && (
        <h2 className="text-center text-2xl pb-5 text-blue-500">
          {manualTests.length}
        </h2>
      )}
      {manualTests.length == 0 && (
        <h2 className="text-center text-2xl pb-5 text-blue-500">
          No Test Cases
        </h2>
      )}
      <TestList testCases={manualTests} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  // const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);
  const testRailProjectId = params.trId;

  const testCaseData = await getTestCasesFromTestRail(testRailProjectId, 0);

  const manualTests = getManualTests(testCaseData);
  //   console.log(manualTests);
  //   console.log(manualTests.length);
  return { manualTests };
}
