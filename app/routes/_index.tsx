import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  defer,
  redirect,
} from "@remix-run/node";
import {
  Await,
  Form,
  Link,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { Suspense } from "react";
import { FaUserAstronaut } from "react-icons/fa";
import { getJiraFixVersions, getJiraProjects } from "~/data/jira.server";
import { getTestRailProjects } from "~/data/testrail.server";

export const meta: MetaFunction = () => {
  return [
    { title: "QA Dashboard" },
    { name: "description", content: "Starbase QA Metrics Dashboard" },
  ];
};

export default function Index() {
  const { jiraProjects, testRailProjects, releaseVersions } =
    useLoaderData<typeof loader>();
  const [params, setSearchParams] = useSearchParams();

  const testRailProjectId = params.get("testRailProject") || "4";
  const jiraProjectId = params.get("jiraProject") || "PLAT";
  const fixVersion = params.get("fixVersion") || "NA";

  const handleJiraProjectChangeSelection = (e: any) => {
    const params = new URLSearchParams();
    params.set("jiraProject", e.target.value);
    setSearchParams(params, {
      preventScrollReset: true,
    });
  };

  return (
    <>
      <header>
        <h1 className=" grid justify-center items-center text-4xl text-blue-800 text-center py-2 space-y-2">
          <Link to="/">Starbase QA Metrics Dashboard</Link>
          <div className="flex justify-center items-center text-center">
            <FaUserAstronaut className="text-teal-700" />
          </div>
        </h1>
      </header>
      <div className="flex justify-center py-5">
        <label htmlFor="" className="font-bold text-center">
          Choose your project
        </label>
      </div>
      <div className="flex justify-center items-center text-center pt-2">
        <Form className="grid space-y-2" method="POST">
          <label htmlFor="" className="font-bold">
            Jira Project
          </label>
          {/* <Suspense fallback={<p>Loading Jira Projects.......</p>}>
            <Await resolve={jiraProjects}>
              {(jiraProjects) => (
                <select
                  name="jiraProject"
                  id="jiraProject"
                  data-testid="jiraProject"
                  className="border-blue-600 border-2 rounded-full px-2 py-1"
                  defaultValue={jiraProjectId}
                  onChange={handleJiraProjectChangeSelection}
                >
                  {jiraProjects.map((project: any) => (
                    <option key={project.id} value={project.key}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
            </Await>
          </Suspense> */}
          <select
            name="jiraProject"
            id="jiraProject"
            data-testid="jiraProject"
            className="border-blue-600 border-2 rounded-full px-2 py-1"
            defaultValue={jiraProjectId}
            onChange={handleJiraProjectChangeSelection}
          >
            {jiraProjects.map((project: any) => (
              <option key={project.id} value={project.key}>
                {project.name}
              </option>
            ))}
          </select>

          <label htmlFor="" className="font-bold">
            Test Rail Project
          </label>
          {/* <Suspense fallback={<p>Loading Test Rail Projects.......</p>}>
            <Await resolve={testRailProjects}>
              {(testRailProjects) => (
                <select
                  name="testRailProject"
                  id="testRailProject"
                  data-testid="testRailProject"
                  className="border-green-700 border-2 rounded-full px-2 py-1"
                  defaultValue={testRailProjectId}
                >
                  {testRailProjects.projects.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
            </Await>
          </Suspense> */}
          <select
            name="testRailProject"
            id="testRailProject"
            data-testid="testRailProject"
            className="border-green-700 border-2 rounded-full px-2 py-1"
            defaultValue={testRailProjectId}
          >
            {testRailProjects.projects.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <label htmlFor="" className="font-bold">
            Release Version
          </label>

          <select
            name="fixVersion"
            id="fixVersion"
            data-testid="fixVersion"
            className="border-green-700 border-2 rounded-full px-2 py-1"
            defaultValue={fixVersion}
          >
            <option key="1" value={fixVersion}>
              NA
            </option>
            {releaseVersions.map((version: any) => (
              <option key={version.versionId} value={version.versionName}>
                {version.versionName}
              </option>
            ))}
          </select>

          {/* <label htmlFor="" className="font-bold">
            Changed Jira Project: {params.get("jiraProject")}
          </label> */}

          {/* <input
            type="text"
            name="fixVersion"
            className="border-green-700 border-2 rounded-full px-2 py-1"
            defaultValue={fixVersion}
          /> */}

          <div className="py-5">
            <button className="border-4 border-red-600 rounded-full px-2 py-1">
              View Dashboard
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);

  const jiraProjectId = search.get("jiraProject") || "PLAT";

  search.set("jiraProject", jiraProjectId);

  const testRailId = search.get("testRailProject") || "4";

  search.set("testRailProject", testRailId);

  const testRailProjects = await getTestRailProjects();

  const jiraProjects = await getJiraProjects();

  // console.log("Selected Jira Project", jiraProjectId);

  const releaseVersions = await getJiraFixVersions(jiraProjectId);
  // console.log(releaseVersions);

  // return defer({
  //   jiraProjects,
  //   testRailProjects,
  // });

  return {
    jiraProjects,
    testRailProjects,
    releaseVersions,
  };
}
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const vals = Object.fromEntries(formData);
  // console.log("VALS", vals);

  return redirect(
    `/dashboard/tr/${vals.testRailProject.toString()}/j/${vals.jiraProject.toString()}/fv/${vals.fixVersion.toString()}`
  );
}
