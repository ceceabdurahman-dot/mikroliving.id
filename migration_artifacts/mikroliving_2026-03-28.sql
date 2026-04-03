-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: mikroliving
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contact_channels`
--

DROP TABLE IF EXISTS `contact_channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_channels` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `label` varchar(80) NOT NULL,
  `value_text` varchar(180) NOT NULL,
  `href` varchar(255) DEFAULT NULL,
  `icon_key` varchar(50) DEFAULT NULL,
  `location_label` varchar(180) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_contact_channels_label` (`label`),
  KEY `idx_contact_channels_active` (`is_active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_channels`
--

LOCK TABLES `contact_channels` WRITE;
/*!40000 ALTER TABLE `contact_channels` DISABLE KEYS */;
INSERT INTO `contact_channels` VALUES (1,'WhatsApp','+62 812 3456 7890','https://wa.me/6281234567890','MessageCircle',NULL,1,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(2,'Email Us','hello@mikroliving.local','mailto:hello@mikroliving.local','AtSign',NULL,2,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(3,'Location','Jakarta, Indonesia','#contact','Globe','Jakarta, Indonesia',3,1,'2026-03-26 09:53:19','2026-03-26 09:53:19');
/*!40000 ALTER TABLE `contact_channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
  `source` varchar(50) NOT NULL DEFAULT 'website',
  `admin_note` text DEFAULT NULL,
  `replied_at` datetime DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_inquiries_status_created_at` (`status`,`created_at`),
  KEY `idx_inquiries_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
INSERT INTO `inquiries` VALUES (1,'UI Test','ui-test@example.com','+62 811 1111 1111','Testing contact form submit flow.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 08:43:29','2026-03-26 09:49:33'),(2,'Rate Test 1','rate-test-1@example.com','','This is a valid contact message for rate-limit verification.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 12:10:23','2026-03-26 09:49:33'),(3,'Rate Test 1','rate-test-1@example.com','','This is a valid contact message for rate-limit verification.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 12:33:45','2026-03-26 09:49:33'),(4,'Rate Test 1','rate-test-1@example.com','','This is a valid contact message for rate-limit verification.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 12:41:52','2026-03-26 09:49:33'),(5,'Rate Test 2','rate-test-2@example.com','','This is a valid contact message for rate-limit verification.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 12:41:52','2026-03-26 09:49:33'),(6,'Rate Test 3','rate-test-3@example.com','','This is a valid contact message for rate-limit verification.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 12:41:52','2026-03-26 09:49:33'),(7,'Rate Test 4','rate-test-4@example.com','','This is a valid contact message for rate-limit verification.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 12:41:52','2026-03-26 09:49:33'),(8,'Rate Test 5','rate-test-5@example.com','','This is a valid contact message for rate-limit verification.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 12:41:52','2026-03-26 09:49:33'),(9,'Smoke Test','smoke-test@example.com','+62 812 0000 0000','This is a smoke-test inquiry to verify the public contact flow.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 12:55:51','2026-03-26 09:49:33'),(10,'Controller Split Test','split-test@example.com','','Testing public controller split after backend refactor.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 14:55:59','2026-03-26 09:49:33'),(11,'Repository Layer Test','repo-layer@example.com','','Testing inquiry repository split after backend refactor.','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-25 15:24:14','2026-03-26 09:49:33'),(12,'cece abdurahman','cece.abdurahman@gmail.com','082215777866','Saya mau konsul masalah interior rumah','new','website',NULL,NULL,NULL,NULL,NULL,'2026-03-27 15:38:57','2026-03-27 15:38:57'),(13,'UI Smoke Inquiry','ui-smoke-inquiry@example.com','+62 811 0000 0001','Smoke test inquiry for admin dashboard interactive check.','replied','website','Smoke test inquiry updated through admin flow.','2026-03-28 01:30:00',NULL,NULL,NULL,'2026-03-27 17:55:24','2026-03-27 22:42:02');
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insights`
--

DROP TABLE IF EXISTS `insights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `insights` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag` varchar(60) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `title` varchar(180) NOT NULL,
  `excerpt` varchar(255) NOT NULL,
  `content` mediumtext DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `image_public_id` varchar(255) DEFAULT NULL,
  `author_name` varchar(120) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_insights_slug` (`slug`),
  KEY `idx_insights_listing` (`is_published`,`sort_order`,`published_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insights`
--

LOCK TABLES `insights` WRITE;
/*!40000 ALTER TABLE `insights` DISABLE KEYS */;
INSERT INTO `insights` VALUES (1,'Trends','maximizing-space-in-compact-apartments','Maximizing Space in Compact Apartments','Discover clever furniture hacks and architectural tricks to make small spaces feel twice their size.',NULL,'https://picsum.photos/seed/blog1/600/400',NULL,'MikroLiving Studio',1,1,'2026-03-26 16:53:19','2026-03-26 09:53:19','2026-03-26 09:53:19'),(2,'Aesthetics','choosing-the-perfect-earth-tone-palette','Choosing the Perfect Earth-Tone Palette','Why organic colors are dominating modern interiors and how to pair them with raw materials.',NULL,'https://picsum.photos/seed/blog2/600/400',NULL,'MikroLiving Studio',1,2,'2026-03-26 16:53:19','2026-03-26 09:53:19','2026-03-26 09:53:19'),(3,'Material','the-rise-of-sustainable-wood-in-decor','The Rise of Sustainable Wood in Decor','Exploring ethically sourced timber options that add warmth without harming the planet.',NULL,'https://picsum.photos/seed/blog3/600/400',NULL,'MikroLiving Studio',1,3,'2026-03-26 16:53:19','2026-03-26 09:53:19','2026-03-26 09:53:19');
/*!40000 ALTER TABLE `insights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_assets`
--

DROP TABLE IF EXISTS `media_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `public_id` varchar(255) NOT NULL,
  `secure_url` varchar(500) NOT NULL,
  `resource_type` varchar(30) NOT NULL DEFAULT 'image',
  `format` varchar(20) DEFAULT NULL,
  `bytes` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `original_filename` varchar(255) DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_media_assets_public_id` (`public_id`),
  KEY `idx_media_assets_uploaded_by` (`uploaded_by`),
  CONSTRAINT `fk_media_assets_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_assets`
--

LOCK TABLES `media_assets` WRITE;
/*!40000 ALTER TABLE `media_assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `navigation_links`
--

DROP TABLE IF EXISTS `navigation_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `navigation_links` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `label` varchar(80) NOT NULL,
  `url` varchar(255) NOT NULL,
  `location` enum('header','footer','legal') NOT NULL DEFAULT 'header',
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `opens_new_tab` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_navigation_location_label_url` (`location`,`label`,`url`),
  KEY `idx_navigation_location` (`location`,`is_active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `navigation_links`
--

LOCK TABLES `navigation_links` WRITE;
/*!40000 ALTER TABLE `navigation_links` DISABLE KEYS */;
INSERT INTO `navigation_links` VALUES (1,'Home','#home','header',1,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(2,'Studio','#studio','header',2,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(3,'Services','#services','header',3,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(4,'Portfolio','#portfolio','header',4,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(5,'Insights','#insights','header',5,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(6,'Contact','#contact','header',6,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(7,'Studio','#studio','footer',1,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(8,'Portfolio','#portfolio','footer',2,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(9,'Services','#services','footer',3,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(10,'Privacy Policy','#','legal',1,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(11,'Terms of Service','#','legal',2,0,1,'2026-03-26 09:53:19','2026-03-26 09:53:19');
/*!40000 ALTER TABLE `navigation_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_categories`
--

DROP TABLE IF EXISTS `project_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_categories` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `slug` varchar(60) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sort_order` smallint(5) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_categories_name` (`name`),
  UNIQUE KEY `uq_project_categories_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_categories`
--

LOCK TABLES `project_categories` WRITE;
/*!40000 ALTER TABLE `project_categories` DISABLE KEYS */;
INSERT INTO `project_categories` VALUES (1,'Apartment','apartment','Compact urban apartment interiors.',1,1,'2026-03-26 09:49:33','2026-03-26 09:49:33'),(2,'Residential','residential','Residential and landed home interiors.',2,1,'2026-03-26 09:49:33','2026-03-26 09:49:33'),(3,'Kitchen','kitchen','Kitchen and pantry focused projects.',3,1,'2026-03-26 09:49:33','2026-03-26 09:49:33'),(4,'Bedroom','bedroom','Bedroom and private retreat projects.',4,1,'2026-03-26 09:49:33','2026-03-26 09:49:33');
/*!40000 ALTER TABLE `project_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_images`
--

DROP TABLE IF EXISTS `project_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_public_id` varchar(255) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_images_project` (`project_id`,`sort_order`),
  CONSTRAINT `fk_project_images_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_images`
--

LOCK TABLES `project_images` WRITE;
/*!40000 ALTER TABLE `project_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_category_id` smallint(6) DEFAULT NULL,
  `slug` varchar(180) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `size` varchar(50) NOT NULL,
  `size_value` decimal(10,2) DEFAULT NULL,
  `size_unit` varchar(20) NOT NULL DEFAULT 'm2',
  `image_url` varchar(500) NOT NULL,
  `image_public_id` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `style_label` varchar(100) DEFAULT NULL,
  `client_name` varchar(120) DEFAULT NULL,
  `completion_year` year(4) DEFAULT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'published',
  `is_featured` tinyint(1) DEFAULT 0,
  `featured_order` smallint(6) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_projects_slug` (`slug`),
  KEY `idx_projects_category` (`category`),
  KEY `idx_projects_public_listing` (`status`,`is_featured`,`sort_order`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (10,NULL,NULL,'Partisi Ruangan Fungsional','Residential','Bandung','+/- 4 sqm',NULL,'m2','https://ik.imagekit.io/5cf7fu3tc/MikroLiving/11.jpeg',NULL,'Membangun partisi fungsional yang artistik, sehingga fungsi ruangan menjadi maksimal',NULL,NULL,NULL,NULL,'published',0,NULL,0,NULL,NULL,NULL,'2026-03-28 06:07:20','2026-03-28 06:07:20'),(11,NULL,NULL,'Kitchen set minimalis','Kitchen','Bandung','+/- 12 sqm',NULL,'m2','https://ik.imagekit.io/5cf7fu3tc/MikroLiving/5.jpeg',NULL,'Menata dapur secara compact sehingga fungsi penyimpanan maksimal, nyaman dan indah.',NULL,NULL,NULL,NULL,'published',0,NULL,0,NULL,NULL,NULL,'2026-03-28 06:22:05','2026-03-28 06:22:05');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `icon_key` varchar(50) NOT NULL,
  `title` varchar(120) NOT NULL,
  `description` varchar(255) NOT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_services_title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Layout','Interior Design','Comprehensive conceptual and technical planning for any space.',1,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(2,'Building2','Apartment Design','Specialized solutions for compact living and high-rise dwellings.',2,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(3,'Sofa','Custom Furniture','Bespoke pieces crafted specifically for your home\'s dimensions.',3,1,'2026-03-26 09:53:19','2026-03-26 09:53:19'),(4,'Hammer','Design & Build','Integrated project management from concept to completion.',4,1,'2026-03-26 09:53:19','2026-03-26 09:53:19');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_group` varchar(80) NOT NULL,
  `setting_key` varchar(120) NOT NULL,
  `label` varchar(120) NOT NULL,
  `value_type` enum('text','textarea','url','json') NOT NULL DEFAULT 'text',
  `setting_value` longtext DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_site_settings_key` (`setting_key`),
  KEY `idx_site_settings_group_public` (`setting_group`,`is_public`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'branding','brand_name','Brand Name','text','MikroLiving',1,'2026-03-26 09:53:19','2026-03-28 05:58:27'),(2,'hero','hero_headline','Hero Headline','text','Designing Smart Living Spaces',1,'2026-03-26 09:53:19','2026-03-28 05:58:27'),(3,'hero','hero_subheadline','Hero Subheadline','textarea','Creating Elegant & Functional Interiors that resonate with your lifestyle and personality.',1,'2026-03-26 09:53:19','2026-03-28 05:58:27'),(4,'hero','hero_primary_cta_label','Hero Primary CTA Label','text','View Portfolio',1,'2026-03-26 09:53:19','2026-03-28 05:58:27'),(5,'hero','hero_secondary_cta_label','Hero Secondary CTA Label','text','Book Consultation',1,'2026-03-26 09:53:19','2026-03-28 05:58:27'),(6,'hero','hero_image_url','Hero Image URL','url','https://ik.imagekit.io/5cf7fu3tc/MikroLiving/6.jpeg',1,'2026-03-26 09:53:19','2026-03-28 05:58:28'),(7,'hero','hero_stats','Hero Stats','json','[{\"label\":\"Projects\",\"value\":\"150+\"},{\"label\":\"Satisfaction\",\"value\":\"98%\"},{\"label\":\"Years Exp.\",\"value\":\"10+\"}]',1,'2026-03-26 09:53:19','2026-03-28 05:58:28'),(8,'footer','footer_tagline','Footer Tagline','textarea','Crafting intelligent, elegant spaces that elevate the standard of compact and residential living.',1,'2026-03-26 09:53:19','2026-03-28 05:58:28'),(9,'footer','footer_copyright','Footer Copyright','text','(C) 2026 MikroLiving Interior Studio. All rights reserved.',1,'2026-03-26 09:53:19','2026-03-28 05:58:28'),(10,'contact','contact_intro','Contact Intro','textarea','Whether you\'re starting from scratch or renovating a room, our team is ready to bring your vision to life.',1,'2026-03-26 09:53:19','2026-03-28 05:58:28');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(120) NOT NULL,
  `client_label` varchar(180) DEFAULT NULL,
  `quote` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `image_public_id` varchar(255) DEFAULT NULL,
  `rating` tinyint(3) unsigned DEFAULT 5,
  `is_featured` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_testimonials_client` (`client_name`,`client_label`),
  KEY `idx_testimonials_listing` (`is_active`,`is_featured`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'Sarah & Dimas','The Botanica Apartments','MikroLiving transformed our 45sqm apartment into a sanctuary. Their attention to storage solutions and aesthetic flow is truly unmatched in the industry.','https://picsum.photos/seed/client/200/200',NULL,5,1,1,1,'2026-03-26 09:53:19','2026-03-26 09:53:19');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(120) DEFAULT NULL,
  `role` enum('admin','editor') NOT NULL DEFAULT 'admin',
  `avatar_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_role_active` (`role`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$qKdc7Gc.hTci1U/yqaaon.IPPyr4V7aYHfYYHFCLf/sLhKjks2Dxy','admin@mikroliving.local',NULL,'admin',NULL,1,NULL,'2026-03-25 07:31:20','2026-03-26 09:46:39');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'mikroliving'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-28 22:14:44
