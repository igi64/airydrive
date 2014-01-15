CREATE TABLE `tb_session` (
  `sid` 			varchar(255) NOT NULL,
  `session` 		text NOT NULL,
  `expires` 		int(11) DEFAULT NULL,
  PRIMARY KEY 		(`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `tb_oidc_issuer` (
  `id`		 		int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` 			varchar(255) DEFAULT NULL,
  `configuration` 	text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY 		(`id`),
  UNIQUE KEY 		`name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `tb_user` (
  `id`		 		int(10) unsigned NOT NULL AUTO_INCREMENT,
  `oidc_id`         int(10) unsigned DEFAULT NULL,
  `oidc_sub`	 	varchar(255) DEFAULT NULL,
  `email`	 		varchar(255) NOT NULL,
  `email_verified` 	enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY 		(`id`),
  CONSTRAINT       `fk_user_oidc_issuer_id` FOREIGN KEY (oidc_id) REFERENCES tb_oidc_issuer(id), /* ON DELETE SET oidc_id and oidc_sub TO NULL*/
  UNIQUE KEY 	   `uk_oidc_id_sub` (`oidc_id`, `oidc_sub`),
  UNIQUE KEY 	   `uk_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `tb_user`
(`id`, `email`            ) VALUES 
('1',  'izboran@gmail.com'); 

CREATE TABLE `tb_user_info` (
  `id`		 		int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id`         int(10) unsigned NOT NULL,
  `provider`        varchar(255) NOT NULL,
  `given_name` 		varchar(255) DEFAULT NULL,
  `family_name` 	varchar(255) DEFAULT NULL,
  PRIMARY KEY 		(`id`),
  CONSTRAINT       `fk_user_info_user_id` FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE CASCADE,
  UNIQUE KEY 	   `uk_user_provider` (`user_id`, `provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `tb_user_info`
(`id`, `user_id`, `provider`, `given_name`, `family_name`) VALUES 
('1',  '1',       'google',   'Igor',       'Zboran'); 

CREATE TABLE IF NOT EXISTS `tb_folder` (
  `id`        int(10) unsigned NOT NULL auto_increment,
  `owner_id`  int(10) unsigned NOT NULL,
  `mtime`     int(10) unsigned NOT NULL,
  `locked`    enum('1', '0') NOT NULL default '0',
  `hidden`    enum('1', '0') NOT NULL default '0',
  PRIMARY KEY (`id`),
  CONSTRAINT  `fk_folder_user_id` FOREIGN KEY (owner_id) REFERENCES tb_user(id) ON DELETE CASCADE
) AUTO_INCREMENT=1 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `tb_folder`
(`id`, `owner_id`, `mtime`,      `locked`, `hidden`) VALUES 
('1',  '1',        '1383910510', '0',      '0'); 
INSERT INTO `tb_folder`
(`id`, `owner_id`, `mtime`,      `locked`, `hidden`) VALUES 
('2',  '1',        '1383910520', '0',      '0'); 
INSERT INTO `tb_folder`
(`id`, `owner_id`, `mtime`,      `locked`, `hidden`) VALUES 
('3',  '1',        '1383910530', '0',      '0');
INSERT INTO `tb_folder`
(`id`, `owner_id`, `mtime`,      `locked`, `hidden`) VALUES 
('4',  '1',        '1383910540', '0',      '0');
INSERT INTO `tb_folder`
(`id`, `owner_id`, `mtime`,      `locked`, `hidden`) VALUES 
('5',  '1',        '1383910550', '0',      '0');
INSERT INTO `tb_folder`
(`id`, `owner_id`, `mtime`,      `locked`, `hidden`) VALUES 
('6',  '1',        '1383910560', '0',      '0');
INSERT INTO `tb_folder`
(`id`, `owner_id`, `mtime`,      `locked`, `hidden`) VALUES 
('7',  '1',        '1383910570', '0',      '0');
INSERT INTO `tb_folder`
(`id`, `owner_id`, `mtime`,      `locked`, `hidden`) VALUES 
('8',  '1',        '1383910580', '0',      '0');
INSERT INTO `tb_folder`
(`id`, `owner_id`, `mtime`,      `locked`, `hidden`) VALUES 
('9',  '1',        '1383910590', '0',      '0');

CREATE TABLE IF NOT EXISTS `tb_file` (
  `id`        int(10) unsigned NOT NULL auto_increment,
  `owner_id`  int(10) unsigned NOT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `content`   longblob NOT NULL,
  `mime`      varchar(255) NOT NULL default 'unknown',
  `size`      int(10) unsigned NOT NULL default '0',
  `mtime`     int(10) unsigned NOT NULL,
  `locked`    enum('1', '0') NOT NULL default '0',
  `hidden`    enum('1', '0') NOT NULL default '0',
   PRIMARY KEY (`id`),
   CONSTRAINT  `fk_file_user_id` FOREIGN KEY (owner_id) REFERENCES tb_user(id) ON DELETE CASCADE,
   CONSTRAINT  `fk_file_parent_id` FOREIGN KEY (parent_id) REFERENCES tb_file(id)
) AUTO_INCREMENT=1000000001 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000001',  '1',        '1',       'text/plain', '1',    '1383920510', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000002',  '1',        '11',      'text/plain', '2',    '1383920520', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000003',  '1',        '2',       'text/plain', '1',    '1383920530', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000004',  '1',        '4',       'text/plain', '1',    '1383920540', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000005',  '1',        '1',       'text/plain', '1',    '1383920550', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000006',  '1',        '2',       'text/plain', '1',    '1383920560', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000007',  '1',        '1',       'text/plain', '1',    '1383920570', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000008',  '1',        '1',       'text/plain', '1',    '1383920580', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000009',  '1',        '11',      'text/plain', '2',    '1383920590', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000010',  '1',        '2',       'text/plain', '1',    '1383920600', '0',      '0'); 
INSERT INTO `tb_file`
(`id`,          `owner_id`, `content`, `mime`,       `size`, `mtime`,      `locked`, `hidden`) VALUES 
('1000000011',  '1',        '3',       'text/plain', '1',    '1383920610', '0',      '0'); 

CREATE TABLE IF NOT EXISTS `tb_folder_link` (
  `id`        int(10) unsigned NOT NULL auto_increment,
  `user_id`   int(10) unsigned NOT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `folder_id` int(10) unsigned NOT NULL,
  `name`      varchar(255) NOT NULL,
  `mtime`     int(10) unsigned NOT NULL,
  `read`      enum('1', '0') NOT NULL default '1',
  `write`     enum('1', '0') NOT NULL default '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY  `uk_user_parent_name` (`user_id`, `parent_id`, `name`),
  CONSTRAINT  `fk_folder_link_user_id` FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE CASCADE,
  CONSTRAINT  `fk_folder_link_parent_id` FOREIGN KEY (parent_id) REFERENCES tb_folder(id) ON DELETE CASCADE,
  CONSTRAINT  `fk_folder_link_folder_id` FOREIGN KEY (folder_id) REFERENCES tb_folder(id) ON DELETE CASCADE
) AUTO_INCREMENT=1001 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1001', '1',        NULL,       '1',         'My Disk',     '1383930510', '1',    '1');
INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1002', '1',       '1',         '2',         'dir1',        '1383930520', '1',    '1');
INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1003', '1',       '1',         '3',         'dir11',       '1383930530', '1',    '1');
INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1004', '1',       '1',         '4',         'dir2',        '1383930540', '1',    '1');
INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1005', '1',       '1',         '5',         'emptydir',    '1383930550', '1',    '1');
INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1006', '1',       '1',         '6',         'nonemptydir', '1383930560', '1',    '1');
INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1007', '1',       '1',         '7',         'walk',        '1383930570', '1',    '1');
INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1008', '1',        '7',        '8',         'dir1',        '1383930580', '1',    '1');
INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1009', '1',       '7',         '9',         'dir2',        '1383930590', '1',    '1');

CREATE TABLE `tb_file_link` (
  `id`        int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id`   int(10) unsigned NOT NULL,
  `parent_id` int(10) unsigned NOT NULL,
  `file_id`   int(10) unsigned NOT NULL,
  `name`      varchar(255) NOT NULL,
  `mtime`     int(10) unsigned NOT NULL,
  `read`      enum('1', '0') NOT NULL default '1',
  `write`     enum('1', '0') NOT NULL default '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY  `uk_user_parent_name` (`user_id`, `parent_id`, `name`),
  CONSTRAINT  `fk_file_link_user_id` FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE CASCADE,
  CONSTRAINT  `fk_file_link_parent_id` FOREIGN KEY (parent_id) REFERENCES tb_folder(id) ON DELETE CASCADE,
  CONSTRAINT  `fk_file_link_file_id` FOREIGN KEY (file_id) REFERENCES tb_file(id) ON DELETE CASCADE
) AUTO_INCREMENT=1000001001 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001001', '1',       '2',         '1000000001', '1.txt',  '1383940510', '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001002', '1',       '3',         '1000000002', '11.txt', '1383940520', '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001003', '1',       '4',         '1000000003', '2.txt',  '1383940530',  '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001004', '1',       '6',         '1000000004', '4.txt',  '1383940540',  '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001005', '1',       '8',         '1000000005', '1.txt',  '1383940550',  '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001006', '1',       '9',         '1000000006', '2.txt',  '1383940560',  '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001007', '1',       '7',         '1000000007', '1.txt',  '1383940570',  '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001008', '1',       '1',         '1000000008', '1.txt',  '1383940580',  '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001009', '1',       '1',         '1000000009', '11.txt', '1383940590', '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001010', '1',       '1',         '1000000010', '2.txt',  '1383940600', '1',    '1');
INSERT INTO `tb_file_link`
(`id`,         `user_id`, `parent_id`, `file_id`,    `name`,   `mtime`,      `read`, `write`) VALUES 
('1000001011', '1',       '1',         '1000000011', '3.txt',  '1383940610', '1',    '1');
