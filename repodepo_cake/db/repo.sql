-- MySQL dump 10.11
--
-- Host: localhost    Database: repo
-- ------------------------------------------------------
-- Server version	5.0.51a-3ubuntu5.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `activities` (
  `id` char(36) NOT NULL,
  `activitytype_id` char(36) NOT NULL default '',
  `dcpackage_id` char(36) NOT NULL default '',
  `update_id` char(36) NOT NULL default'',
  `version` char(200) NOT NULL default '',
  `file` char(200) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activitytypes`
--

DROP TABLE IF EXISTS `activitytypes`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `activitytypes` (
  `id` char(36) NOT NULL,
  `name` char(36) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `activitytypes`
--

LOCK TABLES `activitytypes` WRITE;
/*!40000 ALTER TABLE `activitytypes` DISABLE KEYS */;
INSERT INTO `activitytypes` VALUES ('497039f2-cd0c-4ca7-958c-19b7ff6df9cd','new','2009-01-16 09:40:34','2009-01-16 09:40:34'),('497039fb-178c-4e41-9797-19b7ff6df9cd','delete','2009-01-16 09:40:43','2009-01-16 09:40:43'),('49703a03-19c4-49cf-a930-19b7ff6df9cd','remove','2009-01-16 09:40:51','2009-01-16 09:40:51'),('497efea9-08b4-4672-b2cb-6371ff6df9cd','update','2009-01-27 14:31:37','2009-01-27 14:31:37');
/*!40000 ALTER TABLE `activitytypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `architectures`
--

DROP TABLE IF EXISTS `architectures`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `architectures` (
  `id` char(36) NOT NULL,
  `name` char(36) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `architectures`
--

LOCK TABLES `architectures` WRITE;
/*!40000 ALTER TABLE `architectures` DISABLE KEYS */;
INSERT INTO `architectures` VALUES ('49630a67-e7a4-4bb3-b8e2-38acff6df9cd','i386','2009-01-06 09:38:15','2009-01-06 09:38:15'),('49630b4b-b31c-45c9-9da9-199fff6df9cd','amd64','2009-01-06 09:42:03','2009-01-06 09:42:03');
/*!40000 ALTER TABLE `architectures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `components`
--

DROP TABLE IF EXISTS `components`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `components` (
  `id` char(36) NOT NULL,
  `componenttype_id` char(36) NOT NULL default '',
  `distribution_id` char(36) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `components`
--

LOCK TABLES `components` WRITE;
/*!40000 ALTER TABLE `components` DISABLE KEYS */;
/*!40000 ALTER TABLE `components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `componenttypes`
--

DROP TABLE IF EXISTS `componenttypes`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `componenttypes` (
  `id` char(36) NOT NULL,
  `name` char(36) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `componenttypes`
--

LOCK TABLES `componenttypes` WRITE;
/*!40000 ALTER TABLE `componenttypes` DISABLE KEYS */;
INSERT INTO `componenttypes` VALUES ('4964f4d7-29f4-4141-a5a3-1584ff6df9cd','main','2009-01-07 20:30:47','2009-01-07 20:30:47'),('4964f4e3-7b6c-4513-90b7-1584ff6df9cd','universe','2009-01-07 20:30:59','2009-01-07 20:30:59'),('4964f4ef-a530-431e-a4c1-1584ff6df9cd','multiverse','2009-01-07 20:31:11','2009-01-07 20:31:11'),('4964f4fc-e850-4e31-8406-1584ff6df9cd','restricted','2009-01-07 20:31:24','2009-01-07 20:31:24');
/*!40000 ALTER TABLE `componenttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dcpackages`
--

DROP TABLE IF EXISTS `dcpackages`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `dcpackages` (
  `id` char(36) NOT NULL,
  `distrocomponent_id` char(36) NOT NULL default '',
  `package_id` char(36) NOT NULL default '',
   `state` ENUM('open', 'locked') NOT NULL default 'open',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `dcpackages`
--

LOCK TABLES `dcpackages` WRITE;
/*!40000 ALTER TABLE `dcpackages` DISABLE KEYS */;
/*!40000 ALTER TABLE `dcpackages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distributions`
--

DROP TABLE IF EXISTS `distributions`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `distributions` (
  `id` char(36) NOT NULL,
  `name` char(36) NOT NULL default '',
  `repoarch_id` char(36) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `distributions`
--

LOCK TABLES `distributions` WRITE;
/*!40000 ALTER TABLE `distributions` DISABLE KEYS */;
/*!40000 ALTER TABLE `distributions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distrocomponent_packages`
--

DROP TABLE IF EXISTS `distrocomponent_packages`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `distrocomponent_packages` (
  `id` char(36) NOT NULL,
  `distrocomponent_id` char(36) NOT NULL default '',
  `package_id` char(36) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `distrocomponent_packages`
--

LOCK TABLES `distrocomponent_packages` WRITE;
/*!40000 ALTER TABLE `distrocomponent_packages` DISABLE KEYS */;
/*!40000 ALTER TABLE `distrocomponent_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distrocomponents`
--

DROP TABLE IF EXISTS `distrocomponents`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `distrocomponents` (
  `id` char(36) NOT NULL,
  `componenttype_id` char(36) NOT NULL default '',
  `distribution_id` char(36) NOT NULL default '',
  `updsource` char(100) NOT NULL default '',
  `dir_common` char(100) NOT NULL default '',
  `dir_specific` char(100) NOT NULL default '',
  `keyring` char(100) NOT NULL default '',
  `u_keyring` char(100) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `distrocomponents`
--

LOCK TABLES `distrocomponents` WRITE;
/*!40000 ALTER TABLE `distrocomponents` DISABLE KEYS */;
/*!40000 ALTER TABLE `distrocomponents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `packages` (
  `id` char(36) NOT NULL,
  `name` char(36) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repoarches`
--

DROP TABLE IF EXISTS `repoarches`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `repoarches` (
  `id` char(36) NOT NULL,
  `repository_id` char(36) NOT NULL default '',
  `architecture_id` char(36) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `repoarches`
--

LOCK TABLES `repoarches` WRITE;
/*!40000 ALTER TABLE `repoarches` DISABLE KEYS */;
/*!40000 ALTER TABLE `repoarches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repositories`
--

DROP TABLE IF EXISTS `repositories`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `repositories` (
  `id` char(36) NOT NULL,
  `name` char(36) NOT NULL default '',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `repositories`
--

LOCK TABLES `repositories` WRITE;
/*!40000 ALTER TABLE `repositories` DISABLE KEYS */;
/*!40000 ALTER TABLE `repositories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `updates`
--

DROP TABLE IF EXISTS `updates`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `updates` (
  `id` char(36) NOT NULL,
  `repoarch_id` char(36) NOT NULL default '',
  `total` int(10) default NULL,
  `completed` int(10) default NULL,
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `updates`
--

LOCK TABLES `updates` WRITE;
/*!40000 ALTER TABLE `updates` DISABLE KEYS */;
/*!40000 ALTER TABLE `updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(127) NOT NULL,
  `password` varchar(40) NOT NULL,
  `active` tinyint(4) NOT NULL default '0',
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('493d8a14-020c-452a-90e6-15c5ff6df9cd','root','958c14fe2674094506944def7f589cf1c7374fa4',1,'2008-12-08 22:56:52','2008-12-08 22:56:52');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;




/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2009-01-22  9:48:21
