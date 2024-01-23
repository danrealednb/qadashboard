CREATE TABLE `bugs` (
	`id` integer PRIMARY KEY NOT NULL,
	`month` text NOT NULL,
	`year` text NOT NULL,
	`total_bugs` integer NOT NULL,
	`dev_bugs` integer NOT NULL,
	`prod_bugs` integer NOT NULL,
	`createdAt` text DEFAULT 'datetime("now")' NOT NULL,
	`updatedAt` text DEFAULT 'datetime("now")' NOT NULL
);
