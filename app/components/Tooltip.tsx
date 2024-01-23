export default function BasicTooltip({
  chartName,
  tooltip,
}: {
  chartName: string;
  tooltip: string;
}) {
  return (
    <>
      <div className="has-tooltip">
        <span className="tooltip rounded shadow-lg p-1 bg-gray-100 text-blue-700 -mt-8">
          {tooltip}
        </span>
        <span className="text-xl font-bold"> {chartName}</span>
      </div>
    </>
  );
}
