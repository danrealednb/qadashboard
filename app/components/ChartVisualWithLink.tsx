import { Link } from "@remix-run/react";

export default function CountVisualWithLink({
  chartName,
  count,
  page,
}: {
  chartName: string;
  count: number;
  page: string;
}) {
  return (
    <>
      <div className="grid justify-center text-center space-y-2">
        <label htmlFor="" className="text-xl font-bold">
          <Link to={page}>{chartName}</Link>
        </label>
        <label htmlFor="" className="text-blue-700 font-bold">
          {count}
        </label>
      </div>
    </>
  );
}
