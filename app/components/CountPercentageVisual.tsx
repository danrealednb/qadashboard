import { Link } from "@remix-run/react";

export default function CountPercentageVisual({
  chartName,
  count,
  percentage,
  page,
}: {
  chartName: string;
  count: number;
  percentage: string;
  page: string;
}) {
  return (
    <>
      <div className="grid justify-center text-center space-y-2">
        <label htmlFor="" className="text-xl font-bold">
          <Link to={page}> {chartName}</Link>
        </label>
        <label htmlFor="" className="text-blue-700 font-bold">
          {count}
        </label>
        <label htmlFor="" className="text-orange-600 font-bold">
          {percentage}%
        </label>
      </div>
    </>
  );
}
