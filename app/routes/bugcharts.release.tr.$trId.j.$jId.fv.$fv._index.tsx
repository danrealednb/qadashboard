import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import StarbaseLineChart from "~/components/LineChart";
import { getBugMetrics, getReleaseBugMetrics, years } from "~/data/db.server";
import { DateTime } from "luxon";

export default function BugCharts() {
  const {
    bugData,
    devBugData,
    prodBugData,
    resolutionTimeData,
    storiesResolved,
    defectSeverityIndex,
  } = useLoaderData<typeof loader>();
  const params = useParams();
  return (
    <>
      <Header
        testRailProjectId={params.trId}
        jiraProjectId={params.jId}
        fixVersionId={params.fv}
      />
      <h1 className="text-center text-2xl py-5 underline">
        Release Bug Charts
      </h1>

      {bugData.length === 0 && (
        <div className="flex justify-center py-2 text-red-500 font-bold">
          No Data To Display
        </div>
      )}

      {bugData.length > 0 && (
        <>
          <h2 className="text-center text-2xl py-5 underline">Total Bugs</h2>
          <StarbaseLineChart chartData={bugData} />

          <h2 className="text-center text-2xl py-5 underline">Dev Bugs</h2>
          <StarbaseLineChart chartData={devBugData} />

          <h2 className="text-center text-2xl py-5 underline">Prod Bugs</h2>
          <StarbaseLineChart chartData={prodBugData} />

          <h2 className="text-center text-2xl py-5 underline">
            Defect Resolution Time
          </h2>
          <StarbaseLineChart chartData={resolutionTimeData} />

          <h2 className="text-center text-2xl py-5 underline">
            Stories Resolved
          </h2>
          <StarbaseLineChart chartData={storiesResolved} />

          <h2 className="text-center text-2xl py-5 underline">
            Defect Severity Index
          </h2>
          <StarbaseLineChart chartData={defectSeverityIndex} />
        </>
      )}
    </>
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const jiraProjectId = params.jId;
  const releaseVersion = params.fv;
  // const url = new URL(request.url);
  // const search = new URLSearchParams(url.search);

  const metrics = await getReleaseBugMetrics(jiraProjectId);

  const bugData = metrics.map((bugs: any) => {
    return {
      name: `${bugs.release_version}`,
      bugs: bugs.total_bugs,
    };
  });

  const devBugData = metrics.map((bugs: any) => {
    return {
      name: `${bugs.release_version}`,
      bugs: bugs.dev_bugs,
    };
  });

  const prodBugData = metrics.map((bugs: any) => {
    return {
      name: `${bugs.release_version}`,
      bugs: bugs.prod_bugs,
    };
  });
  const resolutionTimeData = metrics.map((bugs: any) => {
    return {
      name: `${bugs.release_version}`,
      bugs: bugs.bug_resolution,
    };
  });
  const storiesResolved = metrics.map((bugs: any) => {
    return {
      name: `${bugs.release_version}`,
      bugs: bugs.stories_resolved,
    };
  });
  const defectSeverityIndex = metrics.map((bugs: any) => {
    return {
      name: `${bugs.release_version}`,
      bugs: bugs.defect_severity_index,
    };
  });

  return {
    bugData,
    devBugData,
    prodBugData,
    resolutionTimeData,
    storiesResolved,
    defectSeverityIndex,
  };
}
