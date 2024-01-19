export default function CountVisual({
  chartName,
  count,
}: {
  chartName: string;
  count: number;
}) {
  return (
    <>
      <div className="grid justify-center text-center space-y-2">
        <label htmlFor="" className="text-xl font-bold">
          {chartName}
        </label>
        <label htmlFor="" className="text-blue-700 font-bold">
          {count}
        </label>
      </div>
    </>
  );
}
