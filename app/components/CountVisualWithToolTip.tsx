import BasicTooltip from "./Tooltip";

export default function CountVisualWithTooltip({
  chartName,
  count,
  tooltip,
}: {
  chartName: string;
  count: number;
  tooltip: string;
}) {
  return (
    <>
      <div className="grid justify-center text-center space-y-2 text-pretty">
        <BasicTooltip chartName={chartName} tooltip={tooltip} />
        <label htmlFor="" className="text-blue-700 font-bold">
          {count}
        </label>
      </div>
    </>
  );
}
