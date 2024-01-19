import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import TestList from "~/components/TestList";
import { getAllTestCases, getManualTests } from "~/data/testrail.server";

export default function ManualTests() {
  const { manualTests } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl">Manual Tests</h1>
      <TestList testCases={manualTests} />
    </>
  );
}

export async function loader() {
  const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);

  const manualTests = getManualTests(testCaseData);
  //   console.log(manualTests);
  //   console.log(manualTests.length);
  return { manualTests };
}
