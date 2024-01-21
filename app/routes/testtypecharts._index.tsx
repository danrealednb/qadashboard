import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import StarbaseLineChartTests from "~/components/LineChartTests";
import {
  TEST_TYPES,
  getTestTypeMetrics,
  testTypeMappingDB,
  years,
} from "~/data/db.server";

export default function TestTypeCharts() {
  const { testTypes, chartData, years, testTypeTitle } =
    useLoaderData<typeof loader>();

  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">Test Type Charts</h1>
      <div className="flex justify-center">
        <Form className="grid justify-center space-y-5">
          <label htmlFor="" className="font-bold text-center">
            Select Year
          </label>
          <select
            id="year"
            name="year"
            className="border-2 border-white rounded"
            defaultValue={years[0]}
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
            defaultValue={testTypes[0]}
          >
            {testTypes.map((tt) => {
              return (
                <option key={tt} value={tt}>
                  {tt}
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
      <div className="grid justify-center py-10">
        <h2 className="text-xl font-bold text-center">{testTypeTitle} Tests</h2>
        <StarbaseLineChartTests chartData={chartData} />
      </div>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);

  const year = search.get("year") || "2023";
  const testType = search.get("testType") || "Total";
  const testTypeTitle = testType;
  const dbTestTypeMetrics = await getTestTypeMetrics(year);

  const dbTestType = testTypeMappingDB(testType);

  const chartData = dbTestTypeMetrics.map((test: any) => {
    return {
      name: `${test.month}`,
      tests: test[dbTestType],
    };
  });

  const testTypes = TEST_TYPES;

  return { testTypes, chartData, years, testTypeTitle };
}
