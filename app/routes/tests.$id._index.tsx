import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import TestList from "~/components/TestList";
import {
  getCustomTestCaseTypes,
  getTestCasesFromTestRail,
  getTestTypeTests,
} from "~/data/testrail.server";

export default function TestsForType() {
  const { testData, headerTestType } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">
        {headerTestType[0].testCaseType}
      </h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {testData.length}
      </h2>
      <TestList testCases={testData} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const testTypeId = params.id;
  // const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);

  const testCaseData = await getTestCasesFromTestRail(0);

  const testData = getTestTypeTests(testCaseData, parseInt(testTypeId!!) || 1);

  //   const testCaseTypes = await getTestCaseTypes();
  //   console.log("Test Case Types", testCaseTypes);

  const customTestCaseTypes = await getCustomTestCaseTypes();
  const headerTestType = customTestCaseTypes.filter(
    (tct) => tct.testCaseTypeId === params.id
  );

  return { testData, headerTestType };
}
