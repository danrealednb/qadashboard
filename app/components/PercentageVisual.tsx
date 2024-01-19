import BasicTooltip from "./Tooltip";

export default function PercentageVisual({
  chartName,
  percentage,
  tooltip,
}: {
  chartName: string;
  percentage: string;
  tooltip: string;
}) {
  return (
    <>
      <div className="grid justify-center text-center space-y-2">
        <BasicTooltip chartName={chartName} tooltip={tooltip} />
        {/* <label htmlFor="" className="text-xl font-bold">
          {chartName}
        </label> */}
        <label htmlFor="" className="text-orange-600 font-bold">
          {percentage}%
        </label>
      </div>
    </>
  );
}
