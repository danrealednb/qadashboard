import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import TestList from "~/components/TestList";
import {
  getAllTestCases,
  getManualTests,
  getTestCasesFromTestRail,
} from "~/data/testrail.server";

export default function ManualTests() {
  const { manualTests } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">Manual Tests</h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {manualTests.length}
      </h2>
      <TestList testCases={manualTests} />
    </>
  );
}

export async function loader() {
  // const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);

  const testCaseData = await getTestCasesFromTestRail(0);

  const manualTests = getManualTests(testCaseData);
  //   console.log(manualTests);
  //   console.log(manualTests.length);
  return { manualTests };
}
