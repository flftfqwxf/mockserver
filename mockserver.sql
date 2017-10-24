# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.14)
# Database: mockserver
# Generation Time: 2017-10-24 09:32:35 +0000
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
  `mockid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '接口ID，自动生成',
  `project_id` varchar(20) NOT NULL DEFAULT '' COMMENT '关联的项目ID',
  `api_name` varchar(2000) NOT NULL DEFAULT '' COMMENT '接口名称',
  `api_url` varchar(2000) NOT NULL DEFAULT '' COMMENT '接口地址',
  `api_url_regexp` varchar(2000) DEFAULT NULL COMMENT '接口地址正则',
  `api_content` longtext NOT NULL COMMENT '接口响应数据',
  `api_content_desc` longtext COMMENT '接口响应数据的参数描述',
  `is_proxy` int(1) DEFAULT '0' COMMENT '是否开启二次代理，0为不开启，1为开启',
  `proxy_prefix` varchar(2000) DEFAULT NULL COMMENT '代理前缀',
  `api_header` longtext COMMENT '接口请求HEADER参数',
  `api_header_desc` longtext COMMENT '接口请求HEADER参数说明',
  `api_parms` longtext COMMENT '接口请求POST等表单请求参数',
  `api_parms_desc` longtext COMMENT '接口请求POST等表单请求参数说明',
  `api_type` varchar(11) DEFAULT 'get' COMMENT '接口请求类型，HTTP请求类型，GET,PUT,POST等',
  `api_state_code` int(11) DEFAULT '200' COMMENT '接口响应状态码，200，404等',
  `exact_match` int(1) DEFAULT '1' COMMENT '接口匹配类型，1为全局匹配，0为只匹配【?】前面部分',
  `is_mockjs` int(1) DEFAULT '0' COMMENT '接口响应数据是否使用mockjs',
  `api_lazy_time` int(10) DEFAULT '0' COMMENT '接口响应延迟时间，单位为毫秒，默认0',
  `api_querys_desc` longtext COMMENT '接口请求url中？后参数说明',
  `api_req_header` longtext COMMENT '接口响应HEADER参数',
  `api_req_header_desc` longtext COMMENT '接口响应HEADER参数说明',
  `swagger_url` varchar(2000) DEFAULT NULL COMMENT '接口对应的swagger 接口路径，用于在swagger tab中，显示指定接口',
  PRIMARY KEY (`mockid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_mockserver` WRITE;
/*!40000 ALTER TABLE `mock_mockserver` DISABLE KEYS */;

INSERT INTO `mock_mockserver` (`mockid`, `project_id`, `api_name`, `api_url`, `api_url_regexp`, `api_content`, `api_content_desc`, `is_proxy`, `proxy_prefix`, `api_header`, `api_header_desc`, `api_parms`, `api_parms_desc`, `api_type`, `api_state_code`, `exact_match`, `is_mockjs`, `api_lazy_time`, `api_querys_desc`, `api_req_header`, `api_req_header_desc`, `swagger_url`)
VALUES
	(85,'8a15fbb94471050bb46f','mockjs-demo-打开接口-刷新页面数据会随机变化','demo1',NULL,'{\r\n  \"array|1-10\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}',0,'','{\r\n  \"headere1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}','get',200,0,1,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}','{\r\n  \"header1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}',NULL),
	(86,'8a15fbb94471050bb46f','404-code-status-demo-请求返回状态为：404','demo2',NULL,'{\r\n  \"array|1-10\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}',0,'','{\r\n  \"headere1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}','get',404,0,1,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}','{\r\n  \"header1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}',NULL),
	(88,'8a15fbb94471050bb46f','dealy-3-second-demo-延迟3秒返回数据','dealy-3-second-demo',NULL,'{\r\n  \"array|1-10\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}',0,'','{\r\n  \"headere1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}','get',404,0,1,3000,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}','{\r\n  \"header1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}',NULL),
	(89,'8a15fbb94471050bb46f','switch-to-real-data-点击关闭二次代理，将访问模拟数据，开启二次代理-访问真实服务的数据','demo/switch-to-real-data',NULL,'{\r\n  \"array|1-10\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}',1,'http://47.93.62.181:8034','{\r\n  \"headere1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}','get',404,0,1,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}','{\r\n  \"header1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}',NULL),
	(98,'8a15fbb94471050bb46f','RESTful格式示例-修改 :id,:user试试，如 search/4/tom','search/:id/:name','%5Esearch%5C/((?:%5B%5E%5C/%5D+?))%5C/((?:%5B%5E%5C/%5D+?))(?:%5C/(?=$))?$','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}',0,'','{\r\n  \"headere1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}','get',200,0,0,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}','{\r\n  \"header1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}',NULL),
	(104,'8a15fbb94471050bb46f','method为post RESTful格式示例-修改 :id,:user试试，如 search/4/tom','search/:id/:name','%5Esearch%5C/((?:%5B%5E%5C/%5D+?))%5C/((?:%5B%5E%5C/%5D+?))(?:%5C/(?=$))?$','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"POST\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}',0,'','{\r\n  \"headere1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}','post',200,0,0,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}','{\r\n  \"header1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}',NULL),
	(105,'8a15fbb94471050bb46f','method为 put :RESTful格式示例-修改 :id,:user试试，如 search/4/tom','search/:id/:name','%5Esearch%5C/((?:%5B%5E%5C/%5D+?))%5C/((?:%5B%5E%5C/%5D+?))(?:%5C/(?=$))?$','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"PUT\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}',0,'','{\r\n  \"headere1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}','put',200,0,0,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}','{\r\n  \"header1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}',NULL),
	(106,'8a15fbb94471050bb46f','method为 delete','search/:id/:name/ss','%5Esearch%5C/((?:%5B%5E%5C/%5D+?))%5C/((?:%5B%5E%5C/%5D+?))%5C/ss(?:%5C/(?=$))?$','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"PUT\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}',0,'','{\r\n  \"headere1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}','{\r\n  \"username\": \"参数值\",\r\n  \"password\": \"参数值\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}','delete',200,0,1,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}','{\r\n  \"header1\": \"参数值\",\r\n  \"header2\": \"参数值\"\r\n}','{\r\n  \"headere1\": \"参数说明\",\r\n  \"header2\": \"参数说明\"\r\n}',NULL);

/*!40000 ALTER TABLE `mock_mockserver` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mock_project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mock_project`;

CREATE TABLE `mock_project` (
  `project_id` varchar(20) NOT NULL DEFAULT '',
  `project_name` varchar(2000) NOT NULL DEFAULT '',
  `project_prefix` varchar(200) DEFAULT '/',
  `proxy_url` varchar(2000) DEFAULT '',
  `open_proxy` int(1) NOT NULL DEFAULT '1',
  `swagger_url` varchar(2000) DEFAULT NULL COMMENT 'swagger获取接口信息路径',
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_project` WRITE;
/*!40000 ALTER TABLE `mock_project` DISABLE KEYS */;

INSERT INTO `mock_project` (`project_id`, `project_name`, `project_prefix`, `proxy_url`, `open_proxy`, `swagger_url`)
VALUES
	('8a15fbb94471050bb46f','demo','/','http://192.168.1.2',1,''),
	('bb1ddc9459253909d379','sdfsdfsdf','/','',1,'http://127.0.0.1:3000/api-docs.json'),
	('f5e8f1d510cc6e0be603','笔记','/','http://192.168.28.218:8088',1,NULL);

/*!40000 ALTER TABLE `mock_project` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mock_swagger
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mock_swagger`;

CREATE TABLE `mock_swagger` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `header_name` varchar(2000) DEFAULT NULL COMMENT '需要在请求中添中的header字段名,如cookie',
  `header_val` varchar(2000) DEFAULT NULL COMMENT '需要在请求中添中的header字段值',
  `type` int(2) DEFAULT NULL COMMENT 'swagger类型,1为全局，2为单个',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_swagger` WRITE;
/*!40000 ALTER TABLE `mock_swagger` DISABLE KEYS */;

INSERT INTO `mock_swagger` (`id`, `header_name`, `header_val`, `type`)
VALUES
	(1,'cookie','ggg',1),
	(2,'cookie','ggg',1);

/*!40000 ALTER TABLE `mock_swagger` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mock_system
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mock_system`;

CREATE TABLE `mock_system` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `proxy_url` varchar(200) DEFAULT '',
  `headers_white_list` varchar(2000) DEFAULT '',
  `headers_black_list` varchar(2000) DEFAULT 'host\r\naccept-encoding',
  `headers_proxy_state` tinyint(2) DEFAULT '0',
  `language_type` varchar(100) DEFAULT 'cn' COMMENT 'language type:cn|en',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_system` WRITE;
/*!40000 ALTER TABLE `mock_system` DISABLE KEYS */;

INSERT INTO `mock_system` (`id`, `proxy_url`, `headers_white_list`, `headers_black_list`, `headers_proxy_state`, `language_type`)
VALUES
	(4,'http://47.93.62.181:8034','cookie','accept-encoding\r\nhost',0,'cn');

/*!40000 ALTER TABLE `mock_system` ENABLE KEYS */;
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
