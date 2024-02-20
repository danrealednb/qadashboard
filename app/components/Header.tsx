import { Link } from "@remix-run/react";
import { FaUserAstronaut } from "react-icons/fa6";

export default function Header({
  testRailProjectId,
  jiraProjectId,
  fixVersionId,
}: {
  testRailProjectId: string;
  jiraProjectId: string;
  fixVersionId: string;
}) {
  return (
    <>
      <header>
        <h1 className=" grid justify-center items-center text-4xl text-blue-800 text-center py-2 space-y-2">
          <Link to="/">Starbase QA Metrics Dashboard</Link>
          <div className="flex justify-center items-center text-center">
            <FaUserAstronaut className="text-teal-700" />
          </div>
        </h1>
        <nav className="flex justify-center items-center text-center  pb-2 pt-2">
          <ul className="flex justify-center items-center text-center space-x-5">
            <li key={1}>
              <Link to="/" className="underline" data-testid="homeLink">
                Projects
              </Link>
            </li>
            <li key={2}>
              <Link
                to={`/dashboard/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersionId}`}
                className="underline"
                data-testid="homeLink"
              >
                Dashboard
              </Link>
            </li>
            <li key={3}>
              <Link
                to={`/breakdown/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersionId}`}
                className="underline"
                data-testid="breakdownLink"
              >
                Breakdowns
              </Link>
            </li>
          </ul>
        </nav>
        <nav className="flex justify-center items-center text-center  pb-2 pt-2">
          <ul className="flex justify-center items-center text-center space-x-5">
            <li key={4}>
              <Link
                to={`/bugcharts/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersionId}`}
                className="underline"
                data-testid="bugchartsLink"
              >
                Bug Charts
              </Link>
            </li>
            <li key={5}>
              <Link
                to={`/testtypecharts/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersionId}`}
                className="underline"
                data-testid="testtypechartsLink"
              >
                Test Charts
              </Link>
            </li>
            <li key={6}>
              <Link
                to={`/add/monthly/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersionId}`}
                className="underline"
                data-testid="monthlyLink"
              >
                Save Monthly Data
              </Link>
            </li>
          </ul>
        </nav>
        <nav className="flex justify-center items-center text-center  pb-2 pt-2">
          <ul className="flex justify-center items-center text-center space-x-5">
            <li key={7}>
              <Link
                to={`/bugcharts/release/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersionId}`}
                className="underline"
                data-testid="bugreleasechartsLink"
              >
                Release Bugs Charts
              </Link>
            </li>
            <li key={8}>
              <Link
                to={`/add/release/tr/${testRailProjectId}/j/${jiraProjectId}/fv/${fixVersionId}`}
                className="underline"
                data-testid="releaseLink"
              >
                Save Release Data
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="grid justify-center text-center font-semibold">
        <label htmlFor="" className="text-green-700">
          Test Rail Project Id: {testRailProjectId}
        </label>
        <label htmlFor="" className="text-blue-700">
          Jira Project Key: {jiraProjectId}
        </label>
        <label htmlFor="" className="text-blue-700">
          Release Version: {fixVersionId}
        </label>
      </div>
    </>
  );
}
