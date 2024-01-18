import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import StarbasePieChart from "~/components/StarbasePieChart";

export const meta: MetaFunction = () => {
  return [
    { title: "QA Dashboard" },
    { name: "description", content: "Starbase QA Metrics Dashboard" },
  ];
};

export default function Index() {
  const testRailData = useLoaderData<typeof loader>();
  return (
    <>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1>Welcome to Remix</h1>
        <ul>
          <li>
            <a
              target="_blank"
              href="https://remix.run/tutorials/blog"
              rel="noreferrer"
            >
              15m Quickstart Blog Tutorial
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://remix.run/tutorials/jokes"
              rel="noreferrer"
            >
              Deep Dive Jokes App Tutorial
            </a>
          </li>
          <li>
            <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
              Remix Docs
            </a>
          </li>
        </ul>
      </div>
      <StarbasePieChart />
      <div>
        <ul className="grid justify-center space-y-2">
          {testRailData.map((testEntry: any, index: number) => (
            <li className="grid justify-center" key={index}>
              <label htmlFor="">Test Id {testEntry.test_id}</label>
              <label htmlFor="">Status {testEntry.status_id}</label>
              <label htmlFor="">Created On {testEntry.created_on}</label>
              <label htmlFor="">Environment {testEntry.version}</label>
              <label htmlFor="">Duration {testEntry.elapsed}</label>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function loader() {
  const headers = {
    Authorization: `Basic ${process.env.TEST_RAIL_API_KEY}`,
  };
  const res = await fetch(
    `https://${process.env.TEST_RAIL_INSTANCE}/index.php?/api/v2/get_results_for_run/2`,
    { headers }
  );
  const data = await res.json();
  const numberOfTestCaseResultsInRun = data.size;
  console.log(numberOfTestCaseResultsInRun);
  console.log(data.results.length);
  const testRailData = data.results;
  // console.log(testRailData);

  // return json(await res.json());
  return testRailData;
}
