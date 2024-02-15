import { TEST_CASE } from "~/data/testrail.server";
import { testTypeMapping } from "../utils/testTypes";

export default function TestList({
  testCases,
}: {
  testCases: Array<TEST_CASE>;
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
      {testCases.length > 0 && (
        <div className="flex justify-center">
          <table className="">
            <thead>
              <tr className="text-center border-2 border-gray-900">
                <th className="border-r-2 border-gray-900 px-2 py-1">Title</th>
                <th className="border-r-2 border-gray-900 px-2 py-1">Refs</th>
                <th className="px-2 py-1">Type</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((test: TEST_CASE) => (
                <tr className="text-center border-2 border-gray-200">
                  <td className="border-r-2 px-2 py-1">{test.title}</td>
                  {/* <td className="border-r-2 px-2 py-1">{test.refs}</td> */}
                  {test.refs && (
                    <td className="border-r-2 px-2 py-1">
                      {getTestRefsToLinks(test.refs)}
                    </td>
                  )}
                  {!test.refs && <td className="border-r-2 px-2 py-1"></td>}
                  {/* <td className="px-2 py-1">{test.custom_test_case_type}</td> */}
                  {test.custom_test_case_type && (
                    <td className="px-2 py-1">
                      {getTestTypesToStr(test.custom_test_case_type)}
                    </td>
                  )}
                  {!test.custom_test_case_type && (
                    <td className="px-2 py-1"></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
