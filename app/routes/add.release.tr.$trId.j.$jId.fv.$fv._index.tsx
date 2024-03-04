import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { DateTime } from "luxon";
import Header from "~/components/Header";
import { db } from "~/data/config.server";
import { eq, and } from "drizzle-orm";
import {
  getDefectResolutionTime,
  getDefectSeverityIndexMonthly,
  getJiraBugs30Days,
  getJiraBugs30DaysDev,
  getJiraBugs30DaysProd,
  getJiraProjects,
  getJiraStories30Days,
  getResolvedJiraBugs30Days,
} from "~/data/jira.server";
import {
  InsertBugs,
  SelectBugs,
  release_bugs,
} from "~/data/schema.release.bugs.server";
import { InsertTests, SelectTests, tests } from "~/data/schema.tests.server";
import {
  getAutomatedTests,
  getManualTests,
  getTestCasesFromTestRail,
  getTestRailProjects,
  getTestTypeTests,
} from "~/data/testrail.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const testRailProjectId = params.trId;
  const jiraProjectId = params.jId;
  const releaseVersion = params.fv;
  const formData = await request.formData();
  const vals = Object.fromEntries(formData);
  console.log(vals);

  await addBugData(jiraProjectId, releaseVersion);
  return redirect(
    `/dashboard/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${releaseVersion}`
  );
}
export async function loader({ request, params }: LoaderFunctionArgs) {
  const jiraProjectId = params.jId;
  // const fixVersionId = params.fv;
  // use drizzle to get the data

  const bugData = db
    .select()
    .from(release_bugs)
    .where(eq(release_bugs.jira_project_id, jiraProjectId))
    .all();

  return { bugData };
}
async function addBugData(jiraProjectId: string, releaseVersion: string) {
  const jiraDefects30Days = await getJiraBugs30Days(
    jiraProjectId,
    releaseVersion
  );
  const jiraDefects30DaysProd = await getJiraBugs30DaysProd(
    jiraProjectId,
    releaseVersion
  );
  const jiraDefects30DaysDev = await getJiraBugs30DaysDev(
    jiraProjectId,
    releaseVersion
  );
  const jiraStories30Days = await getJiraStories30Days(
    jiraProjectId,
    releaseVersion
  );

  const jiraDefectsResolved30Days = await getResolvedJiraBugs30Days(
    jiraProjectId,
    releaseVersion
  );
  const defectResolutionTime = await getDefectResolutionTime(
    jiraDefectsResolved30Days.jiraData
  );

  const defectSeverityIndex = await getDefectSeverityIndexMonthly(
    jiraDefects30Days
  );

  const record: InsertBugs = {
    jira_project_id: jiraProjectId,
    release_version: releaseVersion,
    total_bugs: jiraDefects30Days.totalJiraIssues,
    dev_bugs: jiraDefects30DaysDev.totalJiraIssues,
    prod_bugs: jiraDefects30DaysProd.totalJiraIssues,
    bug_resolution: defectResolutionTime,
    stories_resolved: jiraStories30Days.totalJiraIssues,
    defect_severity_index: parseFloat(defectSeverityIndex),
  };
  const recordId = db.insert(release_bugs).values(record).run().lastInsertRowid;
  console.log("Inserted Bug Record Id", recordId);
}

export default function Index() {
  const { bugData } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const actionState =
    navigation.state === "submitting"
      ? "Adding Release Data..."
      : navigation.state === "loading"
      ? "Loading Data...!"
      : "";
  const params = useParams();
  return (
    <>
      <Header
        testRailProjectId={params.trId}
        jiraProjectId={params.jId}
        fixVersionId={params.fv}
      />
      {params.fv === "NA" && (
        <div className="grid justify-center space-y-5 pt-10">
          <label htmlFor="">
            Release Version is NA. Please Select Release Version On Projects
            Page To Add Release Data
          </label>
        </div>
      )}
      {params.fv !== "NA" && (
        <>
          <Form method="POST" className="pt-10">
            <div className="grid justify-center space-y-5">
              <label htmlFor="">Release Version: {params.fv}</label>
              <input
                type="hidden"
                name="release_version"
                value={params.fv}
                disabled
              />

              <div className="flex justify-center py-5">
                <button
                  type="submit"
                  value="Submit"
                  className="rounded-full border-4 border-red-600 px-4"
                >
                  Add Release Data{" "}
                </button>
              </div>
            </div>
          </Form>

          <label className="flex justify-center text-blue-600 font-extrabold py-2">
            {actionState}
          </label>

          <h1 className="flex justify-center py-2 font-bold underline">
            Bugs Log
          </h1>
          <div className="flex justify-center">
            <ul className="grid justify-center py-2">
              {bugData.map((d: SelectBugs) => (
                <li key={d.id}>
                  Release {d.release_version} - Bugs: {d.total_bugs}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
