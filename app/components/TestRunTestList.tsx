import { TEST_CASE_RESULT } from "~/data/testrail.server";
import { testTypeMapping } from "../utils/testTypes";

export default function TestRunTestList({
  testCases,
  counts,
}: {
  testCases: Array<TEST_CASE_RESULT>;
  counts: {
    passed: number;
    failed: number;
    blocked: number;
    retest: number;
    untested: number;
  };
}) {
  const getTestTypesToStr = (testTypes: Array<number>) => {
    const mappedTypes = testTypes.map((test: number) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {testTypeMapping(test)}
      </span>
    ));

    return mappedTypes;
  };

  const getTestRefsToLinks = (testRefs: string) => {
    const refsArr = testRefs.split(",");

    const refLinks = refsArr.map((ref: string) => (
      <a
        className="underline text-blue-600"
        href={`https://eyeota.atlassian.net/browse/${ref}`}
      >{`${ref}\n`}</a>
    ));

    return refLinks;
  };

  return (
    <>
      <div className="grid justify-center px-4 pb-4 text-pretty">
        <div className="flex">
          <label htmlFor="">Passed: </label>
          <p className="text-green-600 font-bold"> {counts.passed}</p>
        </div>
        <div className="flex">
          <label htmlFor="">Failed: </label>
          <p className="text-red-600 font-bold"> {counts.failed}</p>
        </div>
        <div className="flex">
          <label htmlFor="">Blocked: </label>
          <p className="text-purple-600 font-bold"> {counts.blocked}</p>
        </div>
        <div className="flex">
          <label htmlFor="">Retest: </label>
          <p className="text-yellow-600 font-bold"> {counts.retest}</p>
        </div>
        <div className="flex">
          <label htmlFor="">Untested: </label>
          <p className="text-gray-600 font-bold"> {counts.untested}</p>
        </div>
      </div>
      <div className="flex justify-center px-4 pb-4 text-pretty">
        <table className="">
          <thead>
            <tr className="text-center border-2 border-gray-900">
              <th className="border-r-2 border-gray-900 px-2 py-1">Title</th>
              <th className="border-r-2 border-gray-900 px-2 py-1">Status</th>
              <th className="border-r-2 border-gray-900 px-2 py-1">Refs</th>
              <th className="px-2 py-1">Type</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((test: TEST_CASE_RESULT) => (
              <tr className="text-center border-2 border-gray-200">
                <td className="border-r-2 px-2 py-1">{test.title}</td>

                {test.status === "Passed" && (
                  <td className="border-r-2 px-2 py-1 text-green-600 font-bold">
                    {test.status}
                  </td>
                )}
                {test.status === "Failed" && (
                  <td className="border-r-2 px-2 py-1 text-red-600 font-bold">
                    {test.status}
                  </td>
                )}
                {test.status === "Untested" && (
                  <td className="border-r-2 px-2 py-1 text-gray-600 font-bold">
                    {test.status}
                  </td>
                )}
                {test.status === "Blocked" && (
                  <td className="border-r-2 px-2 py-1 text-purple-600 font-bold">
                    {test.status}
                  </td>
                )}
                {test.status === "Retest" && (
                  <td className="border-r-2 px-2 py-1 text-orange-500 font-bold">
                    {test.status}
                  </td>
                )}
                {/* <td className="border-r-2 px-2 py-1">{test.refs}</td> */}
                {test.refs && (
                  <td className="border-r-2 px-2 py-1">
                    {getTestRefsToLinks(test.refs)}
                  </td>
                )}
                {!test.refs && <td className="border-r-2 px-2 py-1"></td>}
                {/* <td className="px-2 py-1">{test.custom_test_case_type}</td> */}
                {test.test_case_type && (
                  <td className="px-2 py-1">
                    {getTestTypesToStr(test.test_case_type)}
                  </td>
                )}
                {!test.test_case_type && <td className="px-2 py-1"></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
