# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.14)
# Database: mockserver
# Generation Time: 2017-04-11 10:59:08 +0000
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
  `project_id` int(11) NOT NULL DEFAULT '0' COMMENT '关联的项目ID',
  `api_name` varchar(2000) NOT NULL DEFAULT '' COMMENT '接口名称',
  `api_url` varchar(2000) NOT NULL DEFAULT '' COMMENT '接口地址',
  `api_content` longtext NOT NULL COMMENT '接口响应数据',
  `api_content_desc` longtext COMMENT '接口响应数据的参数描述',
  `is_proxy` int(1) DEFAULT '0' COMMENT '是否开启二次代理，0为不开启，1为开启',
  `proxy_prefix` varchar(2000) DEFAULT NULL COMMENT '代理前缀',
  `api_header` longtext COMMENT '接口请求HEADER参数',
  `api_header_desc` longtext COMMENT '接口请求HEADER参数说明',
  `api_parms` longtext COMMENT '接口请求POST等表单请求参数',
  `api_parms_desc` longtext COMMENT '接口请求POST等表单请求参数说明',
  `api_type` varchar(11) DEFAULT 'get' COMMENT '接口请求类型，HTTP请求类型，GET,PUT,POST等',
  `api_state_code` int(11) DEFAULT NULL COMMENT '接口响应状态码，200，404等',
  `exact_match` int(1) DEFAULT '1' COMMENT '接口匹配类型，1为全局匹配，0为只匹配【?】前面部分',
  `is_mockjs` int(1) DEFAULT '0' COMMENT '接口响应数据是否使用mockjs',
  `api_lazy_time` int(10) DEFAULT '0' COMMENT '接口响应延迟时间，单位为毫秒，默认0',
  `api_querys_desc` longtext COMMENT '接口请求url中？后参数说明',
  `api_req_header` longtext COMMENT '接口响应HEADER参数',
  `api_req_header_desc` longtext COMMENT '接口响应HEADER参数说明',
  PRIMARY KEY (`mockid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_mockserver` WRITE;
/*!40000 ALTER TABLE `mock_mockserver` DISABLE KEYS */;

INSERT INTO `mock_mockserver` (`mockid`, `project_id`, `api_name`, `api_url`, `api_content`, `api_content_desc`, `is_proxy`, `proxy_prefix`, `api_header`, `api_header_desc`, `api_parms`, `api_parms_desc`, `api_type`, `api_state_code`, `exact_match`, `is_mockjs`, `api_lazy_time`, `api_querys_desc`, `api_req_header`, `api_req_header_desc`)
VALUES
	(48,3,'sdfsdf','admin/talent-center/get-list','{\r\n  \"code\": 1,\r\n  \"data\": \"\",\r\n  \"message\": \"成功\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}',0,'http://192.168.28.218','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','get',200,0,0,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}',NULL,NULL),
	(55,1,'sdfsdf','admin/users/sign_in2','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}',NULL,1,'','',NULL,'{}',NULL,'get',NULL,1,0,0,NULL,NULL,NULL),
	(56,1,'sdfsdf','admin/users/sign_in44','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}',NULL,1,'','',NULL,'{}',NULL,'get',NULL,1,0,0,NULL,NULL,NULL),
	(57,1,'获取用户信息2','admin/users/show333','{\r\n  \"code\": 1,\r\n  \"data\": {\r\n    \"list\": [\r\n      {\r\n        \"a\": 1,\r\n        \"n\": 4\r\n      }\r\n    ]\r\n  }\r\n}',NULL,1,'http://192.168.28.218','',NULL,'{}',NULL,'get',NULL,1,0,0,NULL,NULL,NULL),
	(58,2,'首页头部-广告','website/banners/index','{\r\n  \"code\": 1,\r\n  \"data\": [\r\n    {\r\n      \"img\": \"http://o8eatr2zr.bkt.clouddn.com/2862333c-fd55-4043-b2e0-ff36f2e84855.jpeg?imageView2/1/w/500/h/200/interlace/1/q/100/format/png\",\r\n      \"url\": \"http://www.baidu.com\",\r\n      \"title\": \"匡恩漏洞挖掘检测平台能为用户做些啥？\"\r\n    },\r\n    {\r\n      \"img\": \"http://o8eatr2zr.bkt.clouddn.com/69177487-a5ed-45ed-9931-572a997c3c26.jpg?imageView2/1/w/500/h/200/interlace/1/q/100/format/png\",\r\n      \"url\": \"\",\r\n      \"title\": \"首届关键基础设施保护工作委员会选举会议在京召开\"\r\n    },\r\n    {\r\n      \"img\": \"http://o8eatr2zr.bkt.clouddn.com/0845a191-7adb-4459-ad7e-d370eda7734e.jpg?imageView2/1/w/500/h/200/interlace/1/q/100/format/png\",\r\n      \"url\": \"\",\r\n      \"title\": \"访谈｜匡恩网络总裁孙一桉\"\r\n    },\r\n    {\r\n      \"img\": \"http://o8eatr2zr.bkt.clouddn.com/69177487-a5ed-45ed-9931-572a997c3c26.jpg?imageView2/1/w/500/h/200/interlace/1/q/100/format/png\",\r\n      \"url\": \"\",\r\n      \"title\": \"首届关键基础设施保护工作委员会选举会议在京召开\"\r\n    },\r\n    {\r\n      \"img\": \"http://o8eatr2zr.bkt.clouddn.com/0845a191-7adb-4459-ad7e-d370eda7734e.jpg?imageView2/1/w/500/h/200/interlace/1/q/100/format/png\",\r\n      \"url\": \"\",\r\n      \"title\": \"访谈｜匡恩网络总裁孙一桉\"\r\n    }\r\n  ],\r\n  \"message\": \"\"\r\n}',NULL,1,'','',NULL,'{}',NULL,'get',NULL,1,0,0,NULL,NULL,NULL),
	(59,2,'首页头部-列表','website/articles/list/','{\r\n  \"code\": 1,\r\n  \"data\": {\r\n    \"list\": [\r\n      {\r\n        \"primary_key\": 1466176262181,\r\n        \"post_id\": 18,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"首届关键基础设施保护工作委员会选举会议在京召开dd\",\r\n        \"post_short_content\": \"5月21日，中国网络安全产业联盟第一届关键基础设施保护工作委员会筹备会议暨选举会议（以下简称会议）在北京致真大厦召开。匡恩网络总裁孙一桉先生全票（42票）当选为工作委员会主任，匡恩网络副总裁张葳当选为\",\r\n        \"view_count\": 3879,\r\n        \"vote_count\": 9,\r\n        \"comment_count\": 1635,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [\r\n          {\r\n            \"original\": \"http://o8eatr2zr.bkt.clouddn.com/1b3576f1-92a3-4833-83d8-a38eef69c169.jpg\",\r\n            \"thumbnail\": \"http://o8eatr2zr.bkt.clouddn.com/1b3576f1-92a3-4833-83d8-a38eef69c169.jpg?imageView2/1/w/200/h/150/interlace/1/q/100/format/png\"\r\n          },\r\n          {\r\n            \"original\": \"http://o8eatr2zr.bkt.clouddn.com/69177487-a5ed-45ed-9931-572a997c3c26.jpg\",\r\n            \"thumbnail\": \"http://o8eatr2zr.bkt.clouddn.com/69177487-a5ed-45ed-9931-572a997c3c26.jpg?imageView2/1/w/200/h/150/interlace/1/q/100/format/png\"\r\n          },\r\n          {\r\n            \"original\": \"http://o8eatr2zr.bkt.clouddn.com/69177487-a5ed-45ed-9931-572a997c3c26.jpg\",\r\n            \"thumbnail\": \"http://o8eatr2zr.bkt.clouddn.com/69177487-a5ed-45ed-9931-572a997c3c26.jpg?imageView2/1/w/200/h/150/interlace/1/q/100/format/png\"\r\n          },\r\n          {\r\n            \"original\": \"http://o8eatr2zr.bkt.clouddn.com/69177487-a5ed-45ed-9931-572a997c3c26.jpg\",\r\n            \"thumbnail\": \"http://o8eatr2zr.bkt.clouddn.com/69177487-a5ed-45ed-9931-572a997c3c26.jpg?imageView2/1/w/200/h/150/interlace/1/q/100/format/png\"\r\n          }\r\n        ],\r\n        \"user\": {\r\n          \"user_name\": \"ironhide\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/7e791fd6-2401-4b8b-81a7-025b897628151470464605410?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 1,\r\n          \"is_expert\": 1,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 7\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1466176262,\r\n        \"updated_at\": 1476345867,\r\n        \"created_time\": \"06-17 23:11\"\r\n      },\r\n      {\r\n        \"primary_key\": 14760906391131,\r\n        \"post_id\": 113,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"修改测试文章标题171043\",\r\n        \"post_short_content\": \"修改这里是文章内容171043\",\r\n        \"view_count\": 0,\r\n        \"vote_count\": 0,\r\n        \"comment_count\": 0,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [],\r\n        \"user\": {\r\n          \"user_name\": \"ironhide\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/7e791fd6-2401-4b8b-81a7-025b897628151470464605410?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 1,\r\n          \"is_expert\": 1,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 7\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1476090639,\r\n        \"updated_at\": 1476090639,\r\n        \"created_time\": \"10-10 17:10\"\r\n      },\r\n      {\r\n        \"primary_key\": 14760906371121,\r\n        \"post_id\": 112,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"测试发表文章\",\r\n        \"post_short_content\": \"这里是文章内容\",\r\n        \"view_count\": 0,\r\n        \"vote_count\": 0,\r\n        \"comment_count\": 0,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [],\r\n        \"user\": {\r\n          \"user_name\": \"ironhide\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/7e791fd6-2401-4b8b-81a7-025b897628151470464605410?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 1,\r\n          \"is_expert\": 1,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 7\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1476090637,\r\n        \"updated_at\": 1476090637,\r\n        \"created_time\": \"10-10 17:10\"\r\n      },\r\n      {\r\n        \"primary_key\": 14760890941101,\r\n        \"post_id\": 110,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"修改测试文章标题164459\",\r\n        \"post_short_content\": \"修改这里是文章内容164459\",\r\n        \"view_count\": 3,\r\n        \"vote_count\": 0,\r\n        \"comment_count\": 0,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [],\r\n        \"user\": {\r\n          \"user_name\": \"ironhide\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/7e791fd6-2401-4b8b-81a7-025b897628151470464605410?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 1,\r\n          \"is_expert\": 1,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 7\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1476089094,\r\n        \"updated_at\": 1476089095,\r\n        \"created_time\": \"10-10 16:44\"\r\n      },\r\n      {\r\n        \"primary_key\": 14760816811081,\r\n        \"post_id\": 108,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"修改测试文章标题144125\",\r\n        \"post_short_content\": \"修改这里是文章内容144125\",\r\n        \"view_count\": 1,\r\n        \"vote_count\": 0,\r\n        \"comment_count\": 0,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [],\r\n        \"user\": {\r\n          \"user_name\": \"ironhide\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/7e791fd6-2401-4b8b-81a7-025b897628151470464605410?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 1,\r\n          \"is_expert\": 1,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 7\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1476081681,\r\n        \"updated_at\": 1476081682,\r\n        \"created_time\": \"10-10 14:41\"\r\n      },\r\n      {\r\n        \"primary_key\": 14760816561071,\r\n        \"post_id\": 107,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"修改测试文章标题144100\",\r\n        \"post_short_content\": \"修改测试文章内容144100\",\r\n        \"view_count\": 3,\r\n        \"vote_count\": 0,\r\n        \"comment_count\": 0,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [],\r\n        \"user\": {\r\n          \"user_name\": \"ironhide\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/7e791fd6-2401-4b8b-81a7-025b897628151470464605410?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 1,\r\n          \"is_expert\": 1,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 7\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1476081656,\r\n        \"updated_at\": 1476081657,\r\n        \"created_time\": \"10-10 14:40\"\r\n      },\r\n      {\r\n        \"primary_key\": 1474335542771,\r\n        \"post_id\": 77,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"测试发表文章修改\",\r\n        \"post_short_content\": \"这里是文章内容修改\",\r\n        \"view_count\": 94,\r\n        \"vote_count\": 0,\r\n        \"comment_count\": 4,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [],\r\n        \"user\": {\r\n          \"user_name\": \"leocnd\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/4df27cb9-6574-4c61-9a43-00cb21c1ae2a.jpg?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 2,\r\n          \"is_expert\": 1,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 8\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1474335542,\r\n        \"updated_at\": 1475918638,\r\n        \"created_time\": \"09-20 09:39\"\r\n      },\r\n      {\r\n        \"primary_key\": 1473737909681,\r\n        \"post_id\": 68,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"测试发表文章修改2016-10-08-09_49_22\",\r\n        \"post_short_content\": \"这里是文章内容修改\",\r\n        \"view_count\": 99,\r\n        \"vote_count\": 2,\r\n        \"comment_count\": 3,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [],\r\n        \"user\": {\r\n          \"user_name\": \"tester007\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/Foaif-rR8s9q3LHYxMtHhZqmmrDg?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 1,\r\n          \"is_expert\": 0,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 23\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1473737909,\r\n        \"updated_at\": 1475891359,\r\n        \"created_time\": \"09-13 11:38\"\r\n      },\r\n      {\r\n        \"primary_key\": 1473065208361,\r\n        \"post_id\": 36,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"行业实例：再也不怕那个“偷井盖儿的贼”！\",\r\n        \"post_short_content\": \"物联网安全讯：asdasdasdasdasdasdasdfafsdasdfasdf物联网安全获悉：9月5日，天津滨海供电公司在北塘大街02号电力工井处完成自主研发设计的井盖在线监测装置安装和测试，标志\",\r\n        \"view_count\": 81,\r\n        \"vote_count\": 1,\r\n        \"comment_count\": 1,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [\r\n          {\r\n            \"original\": \"http://o8eatr2zr.bkt.clouddn.com/FlOVM-GTd61UvT6Cq6WHSMrgHy9G\",\r\n            \"thumbnail\": \"http://o8eatr2zr.bkt.clouddn.com/FlOVM-GTd61UvT6Cq6WHSMrgHy9G?imageView2/1/w/200/h/150/interlace/1/q/100/format/png\"\r\n          },\r\n          {\r\n            \"original\": \"http://o8eatr2zr.bkt.clouddn.com/0c380404-61f8-413b-b3e4-3099e383b037.jpg\",\r\n            \"thumbnail\": \"http://o8eatr2zr.bkt.clouddn.com/0c380404-61f8-413b-b3e4-3099e383b037.jpg?imageView2/1/w/200/h/150/interlace/1/q/100/format/png\"\r\n          }\r\n        ],\r\n        \"user\": {\r\n          \"user_name\": \"ironhide\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/7e791fd6-2401-4b8b-81a7-025b897628151470464605410?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 1,\r\n          \"is_expert\": 1,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 7\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1473065208,\r\n        \"updated_at\": 1475216043,\r\n        \"created_time\": \"09-05 16:46\"\r\n      },\r\n      {\r\n        \"primary_key\": 1473243566501,\r\n        \"post_id\": 50,\r\n        \"post_type\": 1,\r\n        \"post_title\": \"行业实例：联通物联网卡在表计企业中获得认可！\",\r\n        \"post_short_content\": \"物联网安全讯：物联网安全获悉：近日，山东威海联通物联网卡在山东贝特智联表计有限公司开通使用，这是继天罡仪表之后，联通物联网卡在表计企业的又一次成功应用。据悉， 贝特智联表计公司主要从事供热计量及节能产\",\r\n        \"view_count\": 63,\r\n        \"vote_count\": 0,\r\n        \"comment_count\": 1,\r\n        \"focus_count\": 0,\r\n        \"has_voted\": 0,\r\n        \"has_favorited\": 0,\r\n        \"attachments\": [\r\n          {\r\n            \"original\": \"http://o8eatr2zr.bkt.clouddn.com/c8d190db-0e53-4c03-b3dd-01ab00673ba8.png\",\r\n            \"thumbnail\": \"http://o8eatr2zr.bkt.clouddn.com/c8d190db-0e53-4c03-b3dd-01ab00673ba8.png?imageView2/1/w/200/h/150/interlace/1/q/100/format/png\"\r\n          }\r\n        ],\r\n        \"user\": {\r\n          \"user_name\": \"tester007\",\r\n          \"avatar\": \"http://o8eatr2zr.bkt.clouddn.com/Foaif-rR8s9q3LHYxMtHhZqmmrDg?imageView2/1/w/50/h/50/interlace/1/q/100/format/png\",\r\n          \"gender\": 1,\r\n          \"is_expert\": 0,\r\n          \"is_admin\": 0,\r\n          \"has_followed\": 0,\r\n          \"user_id\": 23\r\n        },\r\n        \"post_cover\": \"\",\r\n        \"created_at\": 1473243566,\r\n        \"updated_at\": 1474614224,\r\n        \"created_time\": \"09-07 18:19\"\r\n      }\r\n    ],\r\n    \"has_more\": 1,\r\n    \"total_count\": 55\r\n  },\r\n  \"message\": \"\",\r\n  \"proxyDataSource\": \"http://192.168.28.218/api/website/articles/list/\"\r\n}',NULL,1,'','',NULL,'{}',NULL,'get',NULL,1,0,0,NULL,NULL,NULL),
	(61,2,'asdfasdwww','sdfsdfsss','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}',NULL,1,'','',NULL,'{}',NULL,'get',NULL,1,0,0,NULL,NULL,NULL),
	(64,2,'首页头部-广告sdfsdfsdf','web/login','{\r\n  \"arr3ay\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}',NULL,1,'','{\r\n  \"Authorization\": \"Token token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwidXNlcl9uYW1lIjoibGVvY25kIiwiZXhwIjoxNDc5NTQ1OTQ1fQ.zITBrusBsB2B7vdKMjzfU3M05D9RDOVcbgAjqZUu8JU\",\r\n  \"passssord\": \"123456\"\r\n}',NULL,'{\r\n  \"username\": 15800000003,\r\n  \"password\": 123456\r\n}',NULL,'post',NULL,1,0,0,NULL,NULL,NULL),
	(65,2,'登录','website/users/sign_in','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}',1,'','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','post',NULL,1,0,0,NULL,NULL,NULL),
	(66,2,'首页头部-广告sdfsdf','sdfsdfssdfdf?page=2','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}',1,'','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','post',NULL,1,0,0,NULL,NULL,NULL),
	(69,2,'专家详情页 - 关注专家','website/users/follow?user_id=12','{\r\n  \"array\": [\r\n    15,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"userna4me\": \"参数说明\",\r\n  \"passwo4rd\": \"参数说明\"\r\n}',1,'http://192.168.28.218','{\r\n  \"head7ere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"header6e1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"usernam3e\": \"模拟4参数值\",\r\n  \"passwor3d\": \"模拟4参数值\"\r\n}','{\r\n  \"usernam2e\": \"模拟参数值\",\r\n  \"passwor2d\": \"模拟参数值\"\r\n}','get',NULL,1,0,0,NULL,NULL,NULL),
	(70,2,'文章详情页 - 信息+评论列表+话题列表+分享内容','website/articles/show?post_id=26','{\r\n  \"array\": [\r\n    15,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"userna4me\": \"参数说明\",\r\n  \"passwo4rd\": \"参数说明\"\r\n}',1,'http://192.168.28.218','{\r\n  \"Authorization\": \"Token%20token%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwidXNlcl9uYW1lIjoibGVvY25kIiwiZXhwIjoxNDgwNjQ3MTEwfQ.224E9BMv8kLB2iKgJpJUhik4h3bAyjnxXl4Q5h0jxKw\"\r\n}','{\r\n  \"header6e1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"usernam3e\": \"模拟4参数值\",\r\n  \"passwor3d\": \"模拟4参数值\"\r\n}','{\r\n  \"usernam2e\": \"模拟参数值\",\r\n  \"passwor2d\": \"模拟参数值\"\r\n}','get',200,1,0,2000,NULL,NULL,NULL),
	(71,2,'mock-test','mock-test','{\r\n  \"list|1-10\": [\r\n    {\r\n      \"id|+1\": 1\r\n    }\r\n  ]\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}',0,'','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{}','{}','get',501,0,1,0,NULL,NULL,NULL),
	(72,4,'项目列表','project/list','[\r\n  {\r\n    \"project_id\": 2,\r\n    \"project_name\": \"物联安全-web\",\r\n    \"proxy_url\": \"http://192.168.28.218\",\r\n    \"open_proxy\": 1\r\n  },\r\n  {\r\n    \"project_id\": 3,\r\n    \"project_name\": \"物联安全-mobile\",\r\n    \"proxy_url\": \"http://192.168.28.219\",\r\n    \"open_proxy\": 1\r\n  }\r\n]','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}',0,'','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','get',200,0,0,0,NULL,NULL,NULL),
	(73,2,'感动天二','sss?sdfsdf','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}',0,'','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','get',200,1,0,0,NULL,NULL,NULL),
	(74,4,'11111','sdfsdf?dddd','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}',0,'','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','get',200,0,0,5000,NULL,NULL,NULL),
	(75,2,'sdfsdf','ddddd','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}',0,'','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','post',200,0,0,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}',NULL,NULL),
	(77,32,'dddd','test','{\r\n  \"array\": [\r\n    13,\r\n    23,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 1323,\r\n  \"object\": {\r\n    \"a\": \"b3\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参3数说明\",\r\n  \"password\": \"参3数说明\"\r\n}',0,'','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','get',200,1,0,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}',NULL,NULL),
	(78,32,'dddd','testuuyyyy','{\r\n  \"array\": [\r\n    1,\r\n    26666666,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}','{\r\n  \"username\": \"参数说明\",\r\n  \"password\": \"参数说明\"\r\n}',0,'http://192.168.28.213/sdfsdf','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','get',200,1,0,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}',NULL,'{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}'),
	(79,33,'test','knowledge_skill/364','{\r\n  \"array\": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  \"boolean\": true,\r\n  \"null\": null,\r\n  \"number\": 123,\r\n  \"object\": {\r\n    \"a\": \"b\",\r\n    \"c\": \"d\",\r\n    \"e\": \"f\"\r\n  },\r\n  \"string\": \"Hello World\"\r\n}',NULL,1,'http://www.covisiondev.com','{\r\n  \"headere1\": \"模拟参数值\",\r\n  \"header2\": \"模拟参数值\"\r\n}','{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}',NULL,'{\r\n  \"username\": \"模拟参数值\",\r\n  \"password\": \"模拟参数值\"\r\n}','delete',200,0,0,0,'{\r\n  \"query1\": \"参数说明\",\r\n  \"query2\": \"参数说明\"\r\n}',NULL,'{\r\n  \"headere1\": \"headere1参数说明\",\r\n  \"header2\": \"header2参数说明\"\r\n}');

/*!40000 ALTER TABLE `mock_mockserver` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table mock_project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mock_project`;

CREATE TABLE `mock_project` (
  `project_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `project_name` varchar(2000) NOT NULL DEFAULT '',
  `project_prefix` varchar(200) DEFAULT NULL,
  `proxy_url` varchar(2000) DEFAULT NULL,
  `open_proxy` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_project` WRITE;
/*!40000 ALTER TABLE `mock_project` DISABLE KEYS */;

INSERT INTO `mock_project` (`project_id`, `project_name`, `project_prefix`, `proxy_url`, `open_proxy`)
VALUES
	(2,'物联安全-web','/ajax/','http://192.168.28.218',1),
	(3,'物联安全-mobile',NULL,'http://192.168.28.219',1),
	(32,'reactsss','/ajax/','',1),
	(33,'web','/evaluations/','',1);

/*!40000 ALTER TABLE `mock_project` ENABLE KEYS */;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mock_system` WRITE;
/*!40000 ALTER TABLE `mock_system` DISABLE KEYS */;

INSERT INTO `mock_system` (`id`, `proxy_url`, `headers_white_list`, `headers_black_list`, `headers_proxy_state`)
VALUES
	(4,'http://www.covisiondev.com','cookie','accept-encoding',1);

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
