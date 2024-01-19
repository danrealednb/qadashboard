import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import { getAllTestCases, getManualTests } from "~/data/testrail.server";

export default function ManualTests() {
  //   const { tests } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl">Manual Tests</h1>
    </>
  );
}

export async function loader() {
  const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);

  const manualTests = getManualTests(testCaseData);
  console.log(manualTests);
  console.log(manualTests.length);
  return null;
}
