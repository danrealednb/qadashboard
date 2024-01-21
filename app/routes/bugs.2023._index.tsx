import { useLoaderData } from "@remix-run/react";

import Header from "~/components/Header";
import StarbaseLineChart from "~/components/LineChart";
import { getMetrics } from "~/data/db.server";

export default function BugCharts() {
  const { bugData, devBugData, prodBugData } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">2023 Bug Charts</h1>

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

export async function loader() {
  const metrics = await getMetrics("2023");

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

  // console.log(bugData);
  return { bugData, devBugData, prodBugData };
}
