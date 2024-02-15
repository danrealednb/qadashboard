import { Link } from "@remix-run/react";
import { PieChart, Pie, Cell } from "recharts";
import { TEST_RUN_DATA } from "~/data/testrail.server";
import { testRunChartData } from "~/data/testrail.server";

// const data01 = [
//   { name: "Pass", value: 400 },
//   { name: "Fail", value: 300 },
//   { name: "Block", value: 300 },
//   { name: "Retest", value: 200 },
//   { name: "Untested", value: 278 },
// ];

const COLORS = ["#22c55e", "#e11d48", "#9333ea", "#eab308", "#9ca3af"];

export default function StarbasePieChart({
  chartName,
  passed,
  failed,
  blocked,
  retest,
  untested,
  testRunId,
  testRailProjectId,
  jiraProjectId,
}: {
  chartName: string;
  passed: number;
  failed: number;
  blocked: number;
  retest: number;
  untested: number;
  testRunId: number;
  testRailProjectId: string;
  jiraProjectId: string;
}) {
  // const chartData = testRunChartData(runData);
  // console.log(chartData);
  // console.log("CCCC", runData);
  // const data01 = testRunChartData(runData);
  // console.log(data01);

  const data01 = [
    { name: "Pass", value: passed },
    { name: "Fail", value: failed },
    { name: "Block", value: blocked },
    { name: "Retest", value: retest },
    { name: "Untested", value: untested },
  ];

  return (
    <>
      <div className="">
        <PieChart width={1000} height={400} title={chartName}>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={data01}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data01.map((entry, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <text
            x={400 / 2}
            y={50}
            fill="black"
            textAnchor="middle"
            dominantBaseline="central"
          >
            <tspan fontSize="20" className="font-bold">
              <Link
                to={`/testrunresults/tr/${testRailProjectId}/j/${jiraProjectId}/r/${testRunId}`}
              >
                {chartName}
              </Link>
            </tspan>
          </text>
        </PieChart>
      </div>
    </>
  );
}
