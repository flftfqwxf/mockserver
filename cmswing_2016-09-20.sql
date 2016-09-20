# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.14)
# Database: cmswing
# Generation Time: 2016-09-20 06:10:49 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table cmswing_mockserver
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cmswing_mockserver`;

CREATE TABLE `cmswing_mockserver` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `project_name` varchar(20) NOT NULL DEFAULT '',
  `api_name` varchar(20) NOT NULL DEFAULT '',
  `api_url` varchar(20) NOT NULL DEFAULT '',
  `api_cotent` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `cmswing_mockserver` WRITE;
/*!40000 ALTER TABLE `cmswing_mockserver` DISABLE KEYS */;

INSERT INTO `cmswing_mockserver` (`id`, `project_name`, `api_name`, `api_url`, `api_cotent`)
VALUES
	(1,'sdfsdf','sdf','sdf','sdsdfsdfsdf');

/*!40000 ALTER TABLE `cmswing_mockserver` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
