import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import TestList from "~/components/TestList";
import {
  getAllTestCases,
  getAutomatedTests,
  getTestCasesFromTestRail,
} from "~/data/testrail.server";

export default function AutomatedTests() {
  const { automatedTests } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">Automated Tests</h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {automatedTests.length}
      </h2>
      <TestList testCases={automatedTests} />
    </>
  );
}

export async function loader() {
  // const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);

  const testCaseData = await getTestCasesFromTestRail(0);

  const automatedTests = getAutomatedTests(testCaseData);
  //   console.log(automatedTests);
  //   console.log(automatedTests.length);
  return { automatedTests };
}
