import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
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
  return (
    <>
      <Header testRailProjectId={params.id} />
      <h1 className="text-center text-2xl py-5 underline">Automated Tests</h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {automatedTests.length}
      </h2>
      <TestList testCases={automatedTests} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  // const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);
  const testRailProjectId = params.id;

  const testCaseData = await getTestCasesFromTestRail(testRailProjectId, 0);

  const automatedTests = getAutomatedTests(testCaseData);

  return { automatedTests };
}
