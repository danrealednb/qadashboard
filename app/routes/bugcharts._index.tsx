import { Link } from "@remix-run/react";
import Header from "~/components/Header";

export default function BugCharts() {
  const years = ["2023", "2024"];
  return (
    <>
      <Header />
      <h1 className="text-center text-2xl py-5 underline">Bug Charts</h1>
      <div className="flex justify-center">
        <ul className=" space-y-5">
          {years.map((year: string) => (
            <li className="flex justify-center" key={year}>
              <Link
                className="underline text-blue-700 text-xl font-extrabold"
                to={`/bugs/${year}`}
              >
                {year} Bugs
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
