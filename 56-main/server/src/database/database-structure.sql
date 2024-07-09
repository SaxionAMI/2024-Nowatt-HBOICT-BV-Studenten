CREATE DATABASE IF NOT EXISTS `nowatt` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `nowatt`;

CREATE TABLE `users` (
     `id` INT(11) NOT NULL AUTO_INCREMENT,
     `home_connect_access_token` VARCHAR(4096) NULL DEFAULT NULL,
     `home_connect_refresh_token` VARCHAR(256) NULL DEFAULT NULL,
     `home_connect_access_token_refreshed` TIMESTAMP NULL DEFAULT NULL,
     `was_machine_id` VARCHAR(255) NULL DEFAULT NULL,
     `start_time` TIME NULL DEFAULT NULL,
    `end_time` TIME NULL DEFAULT NULL,
    `start_time_weekend` TIME NULL DEFAULT NULL,
    `end_time_weekend` TIME NULL DEFAULT NULL,
    `automatic_notification` BOOLEAN NOT NULL DEFAULT 1,
     `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`)
 );

CREATE TABLE `device_settings` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `device` VARCHAR(255) NOT NULL,
    `setting` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `wasmachine_history` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `wasmachine_id` VARCHAR(255) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

