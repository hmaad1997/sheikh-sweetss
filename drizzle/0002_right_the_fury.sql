CREATE TABLE `accessLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`status` enum('allowed','denied') NOT NULL,
	`reason` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accessLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `authorizedUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` enum('owner','manager','employee') NOT NULL DEFAULT 'employee',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `authorizedUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `authorizedUsers_email_unique` UNIQUE(`email`)
);
