import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import StarbaseLineChart from "~/components/LineChart";
import { getMetrics, years } from "~/data/db.server";
import { DateTime } from "luxon";

export default function BugCharts() {
  const { years, bugData, devBugData, prodBugData } =
    useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">Bug Charts</h1>
      <div className="flex justify-center">
        <Form className="grid justify-center space-y-5">
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

          <button
            type="submit"
            className="border-4 border-blue-700 rounded-full px-4"
          >
            Load Chart Data
          </button>
        </Form>
      </div>

      {bugData.length === 0 && (
        <div className="flex justify-center py-2 text-red-500 font-bold">
          No Data To Display
        </div>
      )}

      {bugData.length > 0 && (
        <>
          <h2 className="text-center text-2xl py-5 underline">Total Bugs</h2>
          <StarbaseLineChart chartData={bugData} />

          <h2 className="text-center text-2xl py-5 underline">Dev Bugs</h2>
          <StarbaseLineChart chartData={devBugData} />

          <h2 className="text-center text-2xl py-5 underline">Prod Bugs</h2>
          <StarbaseLineChart chartData={prodBugData} />
        </>
      )}
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);

  const year = search.get("year") || DateTime.now().year.toString();

  const metrics = await getMetrics(year);

  // console.log(metrics);

  const bugData = metrics.map((bugs: any) => {
    return {
      name: `${bugs.month}`,
      bugs: bugs.total_bugs,
    };
  });

  const devBugData = metrics.map((bugs: any) => {
    return {
      name: `${bugs.month}`,
      bugs: bugs.dev_bugs,
    };
  });

  const prodBugData = metrics.map((bugs: any) => {
    return {
      name: `${bugs.month}`,
      bugs: bugs.prod_bugs,
    };
  });

  return { years, bugData, devBugData, prodBugData };
}