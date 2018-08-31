/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50553
Source Host           : 127.0.0.1:3306
Source Database       : db_clive

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2018-04-12 11:49:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for cl_admins
-- ----------------------------
DROP TABLE IF EXISTS `cl_admins`;
CREATE TABLE `cl_admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '密码',
  `last_login_ip` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '最后登录IP',
  `last_login_time` int(11) NOT NULL DEFAULT '0' COMMENT '最后登录时间',
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of cl_admins
-- ----------------------------
INSERT INTO `cl_admins` VALUES ('1', 'admin', 'cbb2fc826b6cbb2305cca827529b739b', '127.0.0.1', '1523502595', '1');
INSERT INTO `cl_admins` VALUES ('2', '小白', 'cb78913de44f5a36ab63e8ffacde44b0', '', '0', '1');

-- ----------------------------
-- Table structure for cl_chat_log
-- ----------------------------
DROP TABLE IF EXISTS `cl_chat_log`;
CREATE TABLE `cl_chat_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_id` varchar(55) NOT NULL COMMENT '网页用户随机编号(仅为记录参考记录)',
  `from_name` varchar(255) NOT NULL COMMENT '发送者名称',
  `from_avatar` varchar(255) NOT NULL COMMENT '发送者头像',
  `to_id` varchar(55) NOT NULL COMMENT '接收方',
  `to_name` varchar(255) NOT NULL COMMENT '接受者名称',
  `content` text NOT NULL COMMENT '发送的内容',
  `time_line` int(10) NOT NULL COMMENT '记录时间',
  PRIMARY KEY (`id`),
  KEY `fromid` (`from_id`(4)) USING BTREE,
  KEY `toid` (`to_id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_chat_log
-- ----------------------------

-- ----------------------------
-- Table structure for cl_groups
-- ----------------------------
DROP TABLE IF EXISTS `cl_groups`;
CREATE TABLE `cl_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分组id',
  `name` varchar(255) NOT NULL COMMENT '分组名称',
  `status` tinyint(1) NOT NULL COMMENT '分组状态',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_groups
-- ----------------------------
INSERT INTO `cl_groups` VALUES ('1', '售前组', '1');
INSERT INTO `cl_groups` VALUES ('2', '售后组', '1');

-- ----------------------------
-- Table structure for cl_kf_config
-- ----------------------------
DROP TABLE IF EXISTS `cl_kf_config`;
CREATE TABLE `cl_kf_config` (
  `id` int(11) NOT NULL,
  `max_service` int(11) NOT NULL COMMENT '每个客服最大服务的客户数',
  `change_status` tinyint(1) NOT NULL COMMENT '是否启用转接',
  `leave_status` tinyint(4) NOT NULL COMMENT '客服离开时选择的留言方式：0为默认留言板，1为客服状态接受信息',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_kf_config
-- ----------------------------
INSERT INTO `cl_kf_config` VALUES ('1', '5', '1');

-- ----------------------------
-- Table structure for cl_leave_msg
-- ----------------------------
DROP TABLE IF EXISTS `cl_leave_msg`;
CREATE TABLE `cl_leave_msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(155) NOT NULL COMMENT '留言人名称',
  `phone` char(11) NOT NULL COMMENT '留言人手机号',
  `content` varchar(255) NOT NULL COMMENT '留言内容',
  `add_time` int(10) NOT NULL COMMENT '留言时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_leave_msg
-- ----------------------------

-- ----------------------------
-- Table structure for cl_now_data
-- ----------------------------
DROP TABLE IF EXISTS `cl_now_data`;
CREATE TABLE `cl_now_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_talking` int(5) NOT NULL DEFAULT '0' COMMENT '正在咨询的人数',
  `in_queue` int(5) NOT NULL DEFAULT '0' COMMENT '排队等待的人数',
  `online_kf` int(5) NOT NULL COMMENT '在线客服数',
  `success_in` int(5) NOT NULL COMMENT '成功接入用户',
  `total_in` int(5) NOT NULL COMMENT '今日累积接入的用户',
  `now_date` varchar(10) NOT NULL COMMENT '当前日期',
  PRIMARY KEY (`id`),
  KEY `now_date` (`now_date`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_now_data
-- ----------------------------

-- ----------------------------
-- Table structure for cl_reply
-- ----------------------------
DROP TABLE IF EXISTS `cl_reply`;
CREATE TABLE `cl_reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `word` varchar(255) NOT NULL COMMENT '自动回复的内容',
  `status` tinyint(1) NOT NULL DEFAULT '2' COMMENT '是否自动回复',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_reply
-- ----------------------------
INSERT INTO `cl_reply` VALUES ('1', '欢迎使用clive', '2');

-- ----------------------------
-- Table structure for cl_service_data
-- ----------------------------
DROP TABLE IF EXISTS `cl_service_data`;
CREATE TABLE `cl_service_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_talking` int(5) NOT NULL DEFAULT '0' COMMENT '正在咨询的人数',
  `in_queue` int(5) NOT NULL DEFAULT '0' COMMENT '排队等待的人数',
  `online_kf` int(5) NOT NULL COMMENT '在线客服数',
  `success_in` int(5) NOT NULL COMMENT '成功接入用户',
  `total_in` int(5) NOT NULL COMMENT '今日累积接入的用户',
  `add_date` varchar(10) NOT NULL COMMENT '写入的日期',
  `add_hour` varchar(2) NOT NULL COMMENT '写入的小时数',
  `add_minute` varchar(2) NOT NULL COMMENT '写入的分钟数',
  PRIMARY KEY (`id`),
  KEY `add_date,add_hour` (`add_date`,`add_hour`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_service_data
-- ----------------------------

-- ----------------------------
-- Table structure for cl_service_log
-- ----------------------------
DROP TABLE IF EXISTS `cl_service_log`;
CREATE TABLE `cl_service_log` (
  `user_id` varchar(55) NOT NULL COMMENT '会员的id',
  `client_id` varchar(20) NOT NULL COMMENT '会员的客户端标识',
  `user_name` varchar(255) DEFAULT NULL COMMENT '会员名称',
  `user_avatar` varchar(155) NOT NULL COMMENT '会员头像',
  `user_ip` varchar(15) NOT NULL COMMENT '会员的ip',
  `kf_id` varchar(55) NOT NULL COMMENT '服务的客服id',
  `start_time` int(10) NOT NULL COMMENT '开始服务时间',
  `end_time` int(10) DEFAULT '0' COMMENT '结束服务时间',
  `group_id` int(11) NOT NULL COMMENT '服务的客服的分组id',
  KEY `user_id,client_id` (`user_id`,`client_id`) USING BTREE,
  KEY `kf_id,start_time,end_time` (`kf_id`,`start_time`,`end_time`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_service_log
-- ----------------------------

-- ----------------------------
-- Table structure for cl_users
-- ----------------------------
DROP TABLE IF EXISTS `cl_users`;
CREATE TABLE `cl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '客服id',
  `user_name` varchar(255) NOT NULL COMMENT '客服名称',
  `user_pwd` varchar(32) NOT NULL COMMENT '客服登录密码',
  `user_avatar` varchar(255) NOT NULL COMMENT '客服头像',
  `status` tinyint(1) NOT NULL COMMENT '用户状态',
  `online` tinyint(1) NOT NULL DEFAULT '2' COMMENT '是否在线',
  `group_id` int(11) DEFAULT '0' COMMENT '所属分组id',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_users
-- ----------------------------
INSERT INTO `cl_users` VALUES ('1', '客服', 'cb78913de44f5a36ab63e8ffacde44b0', '/uploads/20171024/902b5294f41f6a7d1e1451c7c0969a21.jpg', '1', '2', '1');
INSERT INTO `cl_users` VALUES ('2', '客服2', 'cb78913de44f5a36ab63e8ffacde44b0', '/uploads/20171024/43cb54a995b89d0926e1de31af0074fc.jpg', '1', '2', '1');
INSERT INTO `cl_users` VALUES ('4', '客服3', '61fcb6b65f1d3da179b5b4cf397eda86', '/uploads/20180120/e20f7ab05a193c0dd97271461a898b57.png', '1', '2', '2');
INSERT INTO `cl_users` VALUES ('5', '客服小美', '61fcb6b65f1d3da179b5b4cf397eda86', '/uploads/20180314/e7aa9b1ae857345b99b0a278a8f1b63f.jpeg', '1', '2', '2');

-- ----------------------------
-- Table structure for cl_words
-- ----------------------------
DROP TABLE IF EXISTS `cl_words`;
CREATE TABLE `cl_words` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL COMMENT '常用语内容',
  `add_time` datetime NOT NULL COMMENT '添加时间',
  `status` tinyint(1) NOT NULL COMMENT '是否启用',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cl_words
-- ----------------------------
INSERT INTO `cl_words` VALUES ('1', '欢迎来到clive v1.0.0', '2018-08-06', '1');
