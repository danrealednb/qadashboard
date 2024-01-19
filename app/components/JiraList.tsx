import { JIRA_ISSUE_DATA } from "~/data/jira.server";

export default function JiraList({
  jiraData,
}: {
  jiraData: Array<JIRA_ISSUE_DATA>;
}) {
  return (
    <>
      <div className="flex justify-center">
        {jiraData.length === 0 && (
          <label htmlFor="" className="text-xl font-bold text-red-600">
            No Bugs Found!
          </label>
        )}

        {jiraData.length > 0 && (
          <table className="">
            <thead>
              <tr className="text-center border-2 border-gray-900">
                <th className="border-r-2 border-gray-900 px-2 py-1">Title</th>
                <th className="border-r-2 border-gray-900 px-2 py-1">Id</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
