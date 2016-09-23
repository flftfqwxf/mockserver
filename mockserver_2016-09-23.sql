# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.14)
# Database: mockserver
# Generation Time: 2016-09-23 08:26:30 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table mock_mockserver
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mock_mockserver`;

CREATE TABLE `mock_mockserver` (
  `mockid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `project_name` varchar(2000) NOT NULL DEFAULT '',
  `api_name` varchar(2000) NOT NULL DEFAULT '',
  `api_url` varchar(2000) NOT NULL DEFAULT '',
  `api_content` longtext NOT NULL,
  `is_proxy` int(1) DEFAULT '0',
  `proxy_prefix` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`mockid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_mockserver` WRITE;
/*!40000 ALTER TABLE `mock_mockserver` DISABLE KEYS */;

INSERT INTO `mock_mockserver` (`mockid`, `project_name`, `api_name`, `api_url`, `api_content`, `is_proxy`, `proxy_prefix`)
VALUES
	(48,'aaaa','sdfsdf','/api/login/44','{\r\ncode:1,\r\ndata:\"\",\r\nmessage:\"成功\"\r\n}\r\n',0,NULL),
	(49,'sdfsfd','sdfsdf','/api/h5/articles/index?sort=0&page=1&per=10','{\r\n    code: 1, \r\n    data: {\r\n        list: [\r\n            {\r\n                tableName: \"table_header\", \r\n                sort: 1, \r\n                id: 3, \r\n                tableData: [\r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf1\", \r\n                        sort: 1, \r\n                        id: 1\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf2\", \r\n                        sort: 2, \r\n                        id: 2\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf3\", \r\n                        sort: 3, \r\n                        id: 3\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf\", \r\n                        sort: 4, \r\n                        id: 4\r\n                    }\r\n                ]\r\n            }, \r\n            {\r\n                tableName: \"table_header2\", \r\n                sort: 2, \r\n                id: 4, \r\n                tableData: [\r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf4\", \r\n                        sort: 1, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf5\", \r\n                        sort: 2, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf3\", \r\n                        sort: 3, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf\", \r\n                        sort: 4, \r\n                        id: 5\r\n                    }\r\n                ]\r\n            }, \r\n            {\r\n                tableName: \"table_header4\", \r\n                sort: 2, \r\n                id: 4, \r\n                tableData: [\r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf5\", \r\n                        sort: 1, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf6\", \r\n                        sort: 2, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf7\", \r\n                        sort: 3, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf8\", \r\n                        sort: 4, \r\n                        id: 5\r\n                    }\r\n                ]\r\n            }, \r\n            {\r\n                tableName: \"table_header3\", \r\n                sort: 2, \r\n                id: 4, \r\n                tableData: [\r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf8\", \r\n                        sort: 1, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsd9f\", \r\n                        sort: 2, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsd0f\", \r\n                        sort: 3, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf88\", \r\n                        sort: 4, \r\n                        id: 5\r\n                    }\r\n                ]\r\n            }\r\n        ], \r\n        has_more: 1, \r\n        total_count: 14\r\n    }, \r\n    message: \"\"\r\n}',0,'http://m.wulianaq.com');

/*!40000 ALTER TABLE `mock_mockserver` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
