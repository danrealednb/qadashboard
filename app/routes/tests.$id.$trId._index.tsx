import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import TestList from "~/components/TestList";
import {
  getCustomTestCaseTypes,
  getTestCasesFromTestRail,
  getTestTypeTests,
} from "~/data/testrail.server";
import { testTypeMapping } from "~/utils/testTypes";

export default function TestsForType() {
  const { testData, headerTestType } = useLoaderData<typeof loader>();
  const params = useParams();
  return (
    <>
      <Header testRailProjectId={params.id} />
      <h1 className="text-center text-2xl py-5 underline">{headerTestType}</h1>
      <h2 className="text-center text-2xl pb-5 text-blue-500">
        {testData.length}
      </h2>
      <TestList testCases={testData} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const testTypeId = params.id;
  const testRailProjectId = params.trId;
  // const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);

  const testCaseData = await getTestCasesFromTestRail(testRailProjectId, 0);

  const testData = getTestTypeTests(testCaseData, parseInt(testTypeId!!) || 1);

  //   const testCaseTypes = await getTestCaseTypes();
  //   console.log("Test Case Types", testCaseTypes);

  // const customTestCaseTypes = await getCustomTestCaseTypes();
  // const headerTestType = customTestCaseTypes.filter(
  //   (tct) => tct.testCaseTypeId === params.id
  // );

  const headerTestType = testTypeMapping(parseInt(testTypeId!!));

  return { testData, headerTestType };
}
