import Header from "~/components/Header";
import { getAllTestCases } from "~/data/testrail.server";

export default function Breakdowns() {
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl">Breakdown Page</h1>
    </>
  );
}

export async function loader() {
  const testCaseData = await getAllTestCases();
  console.log(testCaseData);
  return null;
}
