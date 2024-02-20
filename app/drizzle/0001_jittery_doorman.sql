CREATE TABLE `release_bugs` (
	`id` integer PRIMARY KEY NOT NULL,
	`jira_project_id` text NOT NULL,
	`release_version` text NOT NULL,
	`total_bugs` integer NOT NULL,
	`dev_bugs` integer NOT NULL,
	`prod_bugs` integer NOT NULL,
	`bug_resolution` real NOT NULL,
	`stories_resolved` integer NOT NULL,
	`defect_severity_index` real NOT NULL,
	`createdAt` text DEFAULT 'datetime("now")' NOT NULL,
	`updatedAt` text DEFAULT 'datetime("now")' NOT NULL
);
