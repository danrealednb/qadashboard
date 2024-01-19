import { useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import { getAllTestCases, getAutomatedTests } from "~/data/testrail.server";

export default function AutomatedTests() {
  //   const { tests } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl">Automated Tests</h1>
    </>
  );
}

export async function loader() {
  const testCaseData = await getAllTestCases();
  //   console.log(testCaseData);

  const automatedTests = getAutomatedTests(testCaseData);
  console.log(automatedTests);
  console.log(automatedTests.length);
  return null;
}
