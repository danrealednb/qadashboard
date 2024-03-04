import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { DateTime } from "luxon";
import Header from "~/components/Header";
import StarbaseLineChartTests from "~/components/LineChartTests";
import { getTestTypeMetrics, testTypeMappingDB, years } from "~/data/db.server";
import { getCustomTestCaseTypes } from "~/data/testrail.server";

export default function TestTypeCharts() {
  const { testTypes, chartData, years, testTypeTitle } =
    useLoaderData<typeof loader>();

  const params = useParams();

  return (
    <>
      <Header
        testRailProjectId={params.trId}
        jiraProjectId={params.jId}
        fixVersionId={params.fv}
      />
      <h1 className="text-center text-2xl py-5 underline">Test Type Charts</h1>
      <div className="flex justify-center">
        <Form className="grid justify-center space-y-5" method="GET">
          <label htmlFor="" className="font-bold text-center">
            Select Year
          </label>
          <select
            id="year"
            name="year"
            className="border-2 border-white rounded"
            defaultValue={DateTime.now().year.toString()}
          >
            {years.map((year) => {
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <label htmlFor="" className="font-bold text-center">
            Select Test Type
          </label>
          <select
            id="testType"
            name="testType"
            className="border-2 border-white rounded"
            defaultValue="Total"
          >
            {testTypes.map((tt) => {
              return (
                <option key={tt.testCaseTypeId} value={tt.testCaseType}>
                  {tt.testCaseType}
                </option>
              );
            })}
          </select>
          <button
            type="submit"
            className="border-4 border-blue-700 rounded-full px-4"
          >
            Load Chart Data
          </button>
        </Form>
      </div>

      {chartData.length === 0 && (
        <div className="flex justify-center py-5 text-red-500 font-bold">
          No Data To Display
        </div>
      )}
      {chartData.length > 0 && (
        <div className="grid justify-center py-10">
          <h2 className="text-xl font-bold text-center">
            {testTypeTitle} Tests
          </h2>
          <StarbaseLineChartTests chartData={chartData} />
        </div>
      )}
    </>
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const testRailProjectId = params.trId;
  const jiraProjectId = params.jId;
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);

  const year = search.get("year") || DateTime.now().year.toString();
  const testType = search.get("testType") || "Total";

  const testTypeTitle = testType;

  const dbTestTypeMetrics = await getTestTypeMetrics(
    testRailProjectId,
    jiraProjectId,
    year
  );

  // console.log("Db Test Type Metrics", dbTestTypeMetrics);

  const dbTestType = testTypeMappingDB(testType);

  const chartData = dbTestTypeMetrics.map((test: any) => {
    return {
      name: `${test.month}`,
      tests: test[dbTestType],
    };
  });

  // const testTypes = TEST_TYPES;

  const testTypes = await getCustomTestCaseTypes();
  testTypes.unshift({ testCaseTypeId: 97, testCaseType: "Manual" });
  testTypes.unshift({ testCaseTypeId: 98, testCaseType: "Automated" });
  testTypes.unshift({ testCaseTypeId: 99, testCaseType: "Total" });

  return { testTypes, chartData, years, testTypeTitle };
}
