import { JIRA_ISSUE_DATA } from "~/data/jira.server";

export default function JiraList({
  jiraData,
  totalIssues,
}: {
  jiraData: Array<JIRA_ISSUE_DATA>;
  totalIssues: number;
}) {
  return (
    <>
      <div className="grid justify-center">
        {jiraData.length === 0 && (
          <label htmlFor="" className="text-xl font-bold text-red-600">
            No Bugs Found!
          </label>
        )}

        {jiraData.length > 0 && (
          <>
            <h2 className="text-center text-2xl pb-5 text-blue-500">
              Total Bugs: {totalIssues}
            </h2>
            <div className="grid justify-center py-2">
              <label htmlFor="" className="font-semibold text-blue-600">
                Low: {jiraData.filter((d) => d.severity === "Low").length}
              </label>
              <label htmlFor="" className="font-semibold text-yellow-600">
                Medium: {jiraData.filter((d) => d.severity === "Medium").length}
              </label>
              <label htmlFor="" className="font-semibold text-red-600">
                High: {jiraData.filter((d) => d.severity === "High").length}
              </label>
              <label htmlFor="" className="font-semibold text-orange-600">
                Critical:{" "}
                {jiraData.filter((d) => d.severity === "Critical").length}
              </label>
            </div>

            <table className="">
              <thead>
                <tr className="text-center border-2 border-gray-900">
                  <th className="border-r-2 border-gray-900 px-2 py-1">
                    Title
                  </th>
                  <th className="border-r-2 border-gray-900 px-2 py-1">Id</th>
                  <th className="border-r-2 border-gray-900 px-2 py-1">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody>
                {jiraData.map((issue: JIRA_ISSUE_DATA) => (
                  <tr className="text-center border-2 border-gray-200">
                    <td className="border-r-2 px-2 py-1">{issue.title}</td>
                    <td className="border-r-2 px-2 py-1 text-blue-600">
                      <a
                        href={`https://eyeota.atlassian.net/browse/${issue.key}`}
                      >
                        {issue.key}
                      </a>
                    </td>
                    {issue.severity === "Low" && (
                      <td className="border-r-2 px-2 py-1 text-blue-600 font-semibold">
                        {issue.severity}
                      </td>
                    )}
                    {issue.severity === "Medium" && (
                      <td className="border-r-2 px-2 py-1 text-yellow-500 font-semibold">
                        {issue.severity}
                      </td>
                    )}
                    {issue.severity === "High" && (
                      <td className="border-r-2 px-2 py-1 text-red-600 font-semibold">
                        {issue.severity}
                      </td>
                    )}
                    {issue.severity === "Critical" && (
                      <td className="border-r-2 px-2 py-1 text-orange-500 font-semibold">
                        {issue.severity}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}
