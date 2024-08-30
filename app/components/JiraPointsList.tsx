import { JIRA_ISSUE_DATA, JIRA_SPRINT_TEAM_DATA } from "~/data/jira.server";

export default function JiraPointsList({
  jiraData,
}: {
  jiraData: Array<JIRA_SPRINT_TEAM_DATA>;
}) {
  return (
    <>
      <div className="grid justify-center px-4 pb-4">
        {jiraData.length === 0 && (
          <label htmlFor="" className="text-xl font-bold text-red-600">
            No Tickets Found!
          </label>
        )}

        {jiraData.length > 0 && (
          <>
            <table className="">
              <thead>
                <tr className="text-center border-2 border-gray-900">
                  <th className="border-r-2 border-gray-900 px-2 py-1">
                    Title
                  </th>
                  <th className="border-r-2 border-gray-900 px-2 py-1">
                    Assignee
                  </th>
                  <th className="border-r-2 border-gray-900 px-2 py-1">
                    Story Points
                  </th>
                  <th className="border-r-2 border-gray-900 px-2 py-1">
                    QA Assignee
                  </th>
                  <th className="border-r-2 border-gray-900 px-2 py-1">
                    QA Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {jiraData.map((issue: JIRA_SPRINT_TEAM_DATA) => (
                  <tr className="text-center border-2 border-gray-200">
                    <td className="border-r-2 px-2 py-1 text-blue-600">
                      <a
                        href={`https://eyeota.atlassian.net/browse/${issue.key}`}
                      >
                        {issue.title} ({issue.key})
                      </a>
                    </td>
                    <td className="border-r-2 px-2 py-1 font-semibold">
                      {issue.assignee}
                    </td>
                    <td className="border-r-2 px-2 py-1 text-green-600 font-semibold">
                      {issue.story_points}
                    </td>
                    <td className="border-r-2 px-2 py-1 font-semibold">
                      {issue.qa_assignee}
                    </td>
                    <td className="border-r-2 px-2 py-1 text-blue-600 font-semibold">
                      {issue.qa_points}
                    </td>
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
