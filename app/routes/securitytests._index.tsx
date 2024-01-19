import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import TestList from "~/components/TestList";
import {
  getAllTestCases,
  getTestCasesFromTestRail,
  getTestTypeTests,
} from "~/data/testrail.server";

export default function Tests() {
  const { testData } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">Security Tests</h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {testData.length}
      </h2>
      <TestList testCases={testData} />
    </>
  );
}

export async function loader() {
  // const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);

  const testCaseData = await getTestCasesFromTestRail(0);

  const testData = getTestTypeTests(testCaseData, 9);

  return { testData };
}
