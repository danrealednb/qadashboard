CREATE TABLE `tests` (
	`id` integer PRIMARY KEY NOT NULL,
	`month` text NOT NULL,
	`year` text NOT NULL,
	`total_tests` integer NOT NULL,
	`automated_tests` integer NOT NULL,
	`manual_tests` integer NOT NULL,
	`accessibility_tests` integer NOT NULL,
	`data_validation_tests` integer NOT NULL,
	`e2e_tests` integer NOT NULL,
	`functional_tests` integer NOT NULL,
	`integration_tests` integer NOT NULL,
	`performance_tests` integer NOT NULL,
	`load_tests` integer NOT NULL,
	`regression_tests` integer NOT NULL,
	`security_tests` integer NOT NULL,
	`smoke_tests` integer NOT NULL,
	`unit_tests` integer NOT NULL,
	`non_functional_tests` integer NOT NULL,
	`other_tests` integer NOT NULL,
	`createdAt` text DEFAULT 'datetime("now")' NOT NULL,
	`updatedAt` text DEFAULT 'datetime("now")' NOT NULL
);