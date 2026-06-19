-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: todoweek
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `family_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `color` varchar(50) NOT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`category_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `families`
--

DROP TABLE IF EXISTS `families`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `families` (
  `family_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `owner_user_id` int NOT NULL,
  `invite_code` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`family_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `families`
--

LOCK TABLES `families` WRITE;
/*!40000 ALTER TABLE `families` DISABLE KEYS */;
/*!40000 ALTER TABLE `families` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_types`
--

DROP TABLE IF EXISTS `reward_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_types` (
  `reward_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` int NOT NULL,
  PRIMARY KEY (`reward_type_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `reward_types_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_types`
--

LOCK TABLES `reward_types` WRITE;
/*!40000 ALTER TABLE `reward_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `reward_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rewards`
--

DROP TABLE IF EXISTS `rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rewards` (
  `reward_id` int NOT NULL AUTO_INCREMENT,
  `reward_point` int NOT NULL,
  `reward_name` varchar(255) NOT NULL,
  `reward_duration` int DEFAULT NULL,
  `reward_created_by` int NOT NULL,
  `reward_created_at` date NOT NULL,
  `reward_updated_at` date DEFAULT NULL,
  `reward_is_active` tinyint(1) NOT NULL,
  `reward_description` varchar(255) DEFAULT NULL,
  `reward_type_id` int NOT NULL,
  `family_id` int NOT NULL,
  PRIMARY KEY (`reward_id`),
  KEY `reward_type_id` (`reward_type_id`),
  KEY `family_id` (`family_id`),
  KEY `reward_created_by` (`reward_created_by`),
  CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`reward_type_id`) REFERENCES `reward_types` (`reward_type_id`),
  CONSTRAINT `rewards_ibfk_2` FOREIGN KEY (`family_id`) REFERENCES `families` (`family_id`),
  CONSTRAINT `rewards_ibfk_3` FOREIGN KEY (`reward_created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rewards`
--

LOCK TABLES `rewards` WRITE;
/*!40000 ALTER TABLE `rewards` DISABLE KEYS */;
/*!40000 ALTER TABLE `rewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `family_id` int DEFAULT NULL,
  PRIMARY KEY (`role_id`),
  KEY `family_id` (`family_id`),
  CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`family_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin',1,NULL),(2,'parents',1,NULL),(3,'enfants',1,NULL),(4,'temp',1,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `color` varchar(50) NOT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `family_id` int DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  KEY `family_id` (`family_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`family_id`),
  CONSTRAINT `rooms_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_rooms`
--

DROP TABLE IF EXISTS `task_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_rooms` (
  `room_id` int NOT NULL,
  `task_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`room_id`,`task_id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `task_rooms_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`),
  CONSTRAINT `task_rooms_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_rooms`
--

LOCK TABLES `task_rooms` WRITE;
/*!40000 ALTER TABLE `task_rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('en cours','validé','en attente','à faire') NOT NULL,
  `priority` enum('basse','moyenne','haute') DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `recurrence_type` enum('jours','semaine','mois','années') DEFAULT NULL,
  `recurrence_value` int DEFAULT NULL,
  `task_points` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `room_id` int DEFAULT NULL,
  `family_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`task_id`),
  KEY `family_id` (`family_id`),
  KEY `category_id` (`category_id`),
  KEY `user_id` (`user_id`),
  KEY `created_by` (`created_by`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`family_id`),
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `tasks_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `tasks_ibfk_5` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `avatar_url` text,
  `points` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role_id` int NOT NULL DEFAULT '4',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'alex.martin@example.com','$2y$10$fakehashalex1234567890','Martin','Alex','https://i.pravatar.cc/150?img=1',120,1,'2026-05-20 10:21:36','2026-05-20 10:21:36',1),(12,'sophie.durand@example.com','$2y$10$fakehashsophie12345678','Durand','Sophie','https://i.pravatar.cc/150?img=2',340,1,'2026-05-20 10:21:36','2026-05-20 10:21:36',2),(13,'nicolas.bernard@example.com','$2y$10$fakehashnicolas1234567','Bernard','Nicolas','https://i.pravatar.cc/150?img=3',80,1,'2026-05-20 10:21:36','2026-05-20 10:21:36',1),(14,'emma.leroy@example.com','$2y$10$fakehashemma1234567890','Leroy','Emma','https://i.pravatar.cc/150?img=4',560,1,'2026-05-20 10:21:36','2026-05-20 10:21:36',3),(15,'thomas.petit@example.com','$2y$10$fakehashtomas1234567890','Petit','Thomas','https://i.pravatar.cc/150?img=5',210,1,'2026-05-20 10:21:36','2026-05-20 10:21:36',2),(17,'alex.maaaartin@example.com','azerty','Maaaartin','Aaaalex','https://i.praaaavatar.cc/150?img=1',1200,1,'2026-05-20 00:00:00','2026-05-20 00:00:00',1),(19,'alex.maaaartin@exnample.com','$2b$10$yKpsMruu2O2CHYVJ5LFyJerHTx9HxvtZep0T8EUh.35kDKsMcAxNe','Maaaartin','Aaaalex','https://i.praaaavatar.cc/150?img=1',1200,1,'2026-05-19 00:00:00','2026-05-19 00:00:00',1),(21,'nico@nico.nico','$2b$10$ckWirEL0mHA7g9t0LrUGO./BkGdS1Px.59N86Ix.jIT22f4uNr3uG','POLLET','Nicolas',NULL,NULL,1,'2026-05-20 16:49:23',NULL,4),(22,'nico@nicoo.nico','$2b$10$JRtT1yee6OqQfrPm1bMVQOpvlFRcZa5Msv36MKKhkhCMe57wMmb4W','POLLET','Nicolas',NULL,120,1,'2026-05-20 16:50:39','2026-05-21 16:20:47',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_families`
--

DROP TABLE IF EXISTS `users_families`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_families` (
  `family_id` int NOT NULL,
  `user_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`family_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `users_families_ibfk_1` FOREIGN KEY (`family_id`) REFERENCES `families` (`family_id`),
  CONSTRAINT `users_families_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_families`
--

LOCK TABLES `users_families` WRITE;
/*!40000 ALTER TABLE `users_families` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_families` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `validation_tasks`
--

DROP TABLE IF EXISTS `validation_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `validation_tasks` (
  `validation_task_id` int NOT NULL AUTO_INCREMENT,
  `validated_at` date NOT NULL,
  `validated_by` int NOT NULL,
  `duration` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `family_id` int NOT NULL,
  `task_id` int NOT NULL,
  PRIMARY KEY (`validation_task_id`),
  KEY `task_id` (`task_id`),
  KEY `validated_by` (`validated_by`),
  KEY `family_id` (`family_id`),
  CONSTRAINT `validation_tasks_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`),
  CONSTRAINT `validation_tasks_ibfk_2` FOREIGN KEY (`validated_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `validation_tasks_ibfk_3` FOREIGN KEY (`family_id`) REFERENCES `families` (`family_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `validation_tasks`
--

LOCK TABLES `validation_tasks` WRITE;
/*!40000 ALTER TABLE `validation_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `validation_tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-22 10:21:07
