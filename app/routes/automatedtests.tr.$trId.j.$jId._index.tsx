import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import TestList from "~/components/TestList";
import {
  getAllTestCases,
  getAutomatedTests,
  getCustomTestCaseTypes,
  getTestCaseTypes,
  getTestCasesFromTestRail,
} from "~/data/testrail.server";

export default function AutomatedTests() {
  const { automatedTests } = useLoaderData<typeof loader>();
  const params = useParams();
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  return (
    <>
      <Header testRailProjectId={params.trId} jiraProjectId={params.jId} />
      <h1 className="text-center text-2xl py-5 underline">Automated Tests</h1>
      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-500 text-3xl py-5">
          Test Data Loading.....
        </div>
      )}
      {automatedTests.length > 0 && (
        <h2 className="text-center text-2xl pb-5 text-blue-500">
          {automatedTests.length}
        </h2>
      )}
      {automatedTests.length == 0 && (
        <h2 className="text-center text-2xl pb-5 text-blue-500">
          No Test Cases
        </h2>
      )}
      <TestList testCases={automatedTests} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  // const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);
  const testRailProjectId = params.trId;

  const testCaseData = await getTestCasesFromTestRail(testRailProjectId, 0);

  const automatedTests = getAutomatedTests(testCaseData);

  return { automatedTests };
}
