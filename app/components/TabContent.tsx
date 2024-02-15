import { useState } from "react";
import { Tab } from "@headlessui/react";
import { JIRA_ISSUE_FEATURE_DATA } from "~/data/jira.server";
import { DateTime } from "luxon";
import { Link } from "@remix-run/react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function TabContent({
  data,
  jiraProjectId,
  testRailProjectId,
}: {
  data: {
    "To Do": JIRA_ISSUE_FEATURE_DATA[];
    "In Progress": JIRA_ISSUE_FEATURE_DATA[];
    Done: JIRA_ISSUE_FEATURE_DATA[];
  };
  jiraProjectId: string;
  testRailProjectId: string;
}) {
  let [categories] = useState(data);

  return (
    <div className="w-full max-w-md px-2 py-16 sm:px-0 ">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-700 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <ul>
                {posts.map((post) => (
                  <li
                    key={post.key}
                    className="relative rounded-md p-3 hover:bg-gray-100"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      {post.key} - {post.title}
                    </h3>

                    <ul className="mt-1 text-xs font-normal leading-4 text-gray-500 grid">
                      {post.resolutionDate && (
                        <li>
                          Completed:{" "}
                          {DateTime.fromISO(post.resolutionDate).toFormat(
                            "MM-dd-yyyy"
                          )}
                        </li>
                      )}
                    </ul>
                    <Link
                      to={`/featurecoverage/epic/${post.key}/j/${jiraProjectId}/tr/${testRailProjectId}`}
                      className={classNames(
                        "absolute inset-0 rounded-md",
                        "ring-blue-400 focus:z-10 focus:outline-none focus:ring-2"
                      )}
                    ></Link>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
