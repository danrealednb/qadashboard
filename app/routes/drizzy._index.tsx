import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/data/config.server";
import { InsertUser, tests } from "~/data/schema.tests.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const vals = Object.fromEntries(formData);

  const record: InsertUser = {
    month: vals.month.toString(),
    year: vals.year.toString(),
    total_tests: parseInt(vals.total_tests.toString()),
    automated_tests: 0,
    manual_tests: 0,
    accessibility_tests: 0,
    data_validation_tests: 0,
    e2e_tests: 0,
    functional_tests: 0,
    integration_tests: 0,
    performance_tests: 0,
    load_tests: 0,
    regression_tests: 0,
    security_tests: 0,
    smoke_tests: 0,
    unit_tests: 0,
    non_functional_tests: 0,
    other_tests: 0,
  };
  db.insert(tests).values(record).run();
  return {
    success: true,
  };
}
export async function loader({ request }: LoaderFunctionArgs) {
  // use drizzle to get the data
  const data = db.select().from(tests).all();
  console.log("db data", data);
  return { data };
}
export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      <Form method="POST" className="pt-10">
        <div className="grid justify-center space-y-2">
          <input
            type="number"
            placeholder="Total Tests"
            className="border-2 border-blue-600"
            name="total_tests"
            id="total_tests"
          />
          <select name="month" id="month">
            <option value="Jan">Jan</option>
            <option value="Feb">Feb</option>
            <option value="Mar">Mar</option>
            <option value="Apr">Apr</option>
            <option value="May">May</option>
            <option value="Jun">Jun</option>
            <option value="Jul">Jul</option>
            <option value="Aug">Aug</option>
            <option value="Sep">Sep</option>
            <option value="Oct">Oct</option>
            <option value="Nov">Nov</option>
            <option value="Dev">Dev</option>
          </select>
          <input
            type="text"
            placeholder="Year"
            className="border-2 border-blue-600"
            name="year"
            id="year"
          />
          <button type="submit" value="Submit">
            Add Total Tests{" "}
          </button>
        </div>
      </Form>

      <h1 className="flex justify-center py-5">Tests</h1>
      <div className="flex justify-center">
        <ul className="grid justify-center py-2">
          {data.map((d) => (
            <li key={d.id}>
              {d.month} {d.year} {d.total_tests}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
