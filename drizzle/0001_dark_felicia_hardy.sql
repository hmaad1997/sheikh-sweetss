CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopName` varchar(255) NOT NULL DEFAULT 'حلويات الشيخ',
	`whatsappNumber` varchar(20),
	`enableNotifications` boolean NOT NULL DEFAULT true,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`description` text NOT NULL,
	`type` enum('revenue','expense') NOT NULL,
	`paymentMethod` enum('cash','click','visa','bank') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
