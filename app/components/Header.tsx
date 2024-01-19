import { Link } from "@remix-run/react";
import { FaUserAstronaut } from "react-icons/fa6";

export default function Header() {
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
            <li>
              <Link to="/" className="underline" data-testid="homeLink">
                Main
              </Link>
            </li>
            <li>
              <Link
                to="/breakdown"
                className="underline"
                data-testid="breakdownLink"
              >
                Breakdowns
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
