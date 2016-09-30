# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.14)
# Database: mockserver
# Generation Time: 2016-09-30 10:26:56 +0000
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
  `project_id` int(11) NOT NULL DEFAULT '0',
  `api_name` varchar(2000) NOT NULL DEFAULT '',
  `api_url` varchar(2000) NOT NULL DEFAULT '',
  `api_content` longtext NOT NULL,
  `is_proxy` int(1) DEFAULT '0',
  `proxy_prefix` varchar(2000) DEFAULT NULL,
  `api_header` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`mockid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_mockserver` WRITE;
/*!40000 ALTER TABLE `mock_mockserver` DISABLE KEYS */;

INSERT INTO `mock_mockserver` (`mockid`, `project_id`, `api_name`, `api_url`, `api_content`, `is_proxy`, `proxy_prefix`, `api_header`)
VALUES
	(48,2,'sdfsdf','login/44','{\r\ncode:1,\r\ndata:\"\",\r\nmessage:\"成功\"\r\n}\r\n',0,NULL,NULL),
	(49,2,'sdfsdf','h5/articles/index?sort=0&page=1&per=10','{\r\n    code: 1, \r\n    data: {\r\n        list: [\r\n            {\r\n                tableName: \"table_header\", \r\n                sort: 1, \r\n                id: 3, \r\n                tableData: [\r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf1\", \r\n                        sort: 1, \r\n                        id: 1\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf2\", \r\n                        sort: 2, \r\n                        id: 2\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf3\", \r\n                        sort: 3, \r\n                        id: 3\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf\", \r\n                        sort: 4, \r\n                        id: 4\r\n                    }\r\n                ]\r\n            }, \r\n            {\r\n                tableName: \"table_header2\", \r\n                sort: 2, \r\n                id: 4, \r\n                tableData: [\r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf4\", \r\n                        sort: 1, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf5\", \r\n                        sort: 2, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf3\", \r\n                        sort: 3, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf\", \r\n                        sort: 4, \r\n                        id: 5\r\n                    }\r\n                ]\r\n            }, \r\n            {\r\n                tableName: \"table_header4\", \r\n                sort: 2, \r\n                id: 4, \r\n                tableData: [\r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf5\", \r\n                        sort: 1, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf6\", \r\n                        sort: 2, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf7\", \r\n                        sort: 3, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf8\", \r\n                        sort: 4, \r\n                        id: 5\r\n                    }\r\n                ]\r\n            }, \r\n            {\r\n                tableName: \"table_header3\", \r\n                sort: 2, \r\n                id: 4, \r\n                tableData: [\r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsdf8\", \r\n                        sort: 1, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsd9f\", \r\n                        sort: 2, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"1\", \r\n                        title: \"sdfsdfsd0f\", \r\n                        sort: 3, \r\n                        id: 5\r\n                    }, \r\n                    {\r\n                        type: \"2\", \r\n                        title: \"sdfsdfsdf88\", \r\n                        sort: 4, \r\n                        id: 5\r\n                    }\r\n                ]\r\n            }\r\n        ], \r\n        has_more: 1, \r\n        total_count: 14\r\n    }, \r\n    message: \"\"\r\n}',0,'http://m.wulianaq.com',NULL),
	(50,1,'获取用户信息','admin/users/show','{\r\n  \"code\": 1,\r\n  \"data\": {\r\n    \"list\": [\r\n      {\r\n        \"a\": 1,\r\n        \"n\": 2\r\n      }\r\n    ]\r\n  }\r\n}',0,'http://192.168.28.218',''),
	(54,1,'sdfsdf','admin/users/sign_in','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}',0,'',''),
	(55,1,'sdfsdf','admin/users/sign_in2','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}',0,'',''),
	(56,1,'sdfsdf','admin/users/sign_in44','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}',0,'',''),
	(57,1,'获取用户信息2','admin/users/show333','{\r\n  \"code\": 1,\r\n  \"data\": {\r\n    \"list\": [\r\n      {\r\n        \"a\": 1,\r\n        \"n\": 4\r\n      }\r\n    ]\r\n  }\r\n}',0,'http://192.168.28.218','');

/*!40000 ALTER TABLE `mock_mockserver` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mock_project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mock_project`;

CREATE TABLE `mock_project` (
  `project_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `project_name` varchar(2000) NOT NULL DEFAULT '',
  `proxy_url` varchar(2000) DEFAULT NULL,
  `open_proxy` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_project` WRITE;
/*!40000 ALTER TABLE `mock_project` DISABLE KEYS */;

INSERT INTO `mock_project` (`project_id`, `project_name`, `proxy_url`, `open_proxy`)
VALUES
	(2,'物联安全','http://192.168.28.218',1);

/*!40000 ALTER TABLE `mock_project` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mock_template
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mock_template`;

CREATE TABLE `mock_template` (
  `template_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `template_name` varchar(2000) NOT NULL DEFAULT '',
  PRIMARY KEY (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
