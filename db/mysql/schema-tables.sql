CREATE TABLE `tb_session` (
  `sid` 			varchar(255) NOT NULL,
  `session` 		text NOT NULL,
  `expires` 		int(11) DEFAULT NULL,
  PRIMARY KEY 		(`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `tb_oidc` (
  `id`		 		int(10) unsigned NOT NULL AUTO_INCREMENT,
  `issuer` 			varchar(255) DEFAULT NULL,
  `provider`     	text COLLATE utf8_unicode_ci NOT NULL,
  `registration` 	text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY 		(`id`),
  UNIQUE KEY 		`issuer` (`issuer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `tb_oidc_self_issued` (
  `id`		 		int(10) unsigned NOT NULL AUTO_INCREMENT,
  `oidc_id`         int(10) unsigned NOT NULL,
  `sub`     	 	varchar(255) NOT NULL,
  `sub_jwk`	 		text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY 		(`id`),
  CONSTRAINT        `fk_oidc_self_issued_oidc_id` FOREIGN KEY (oidc_id) REFERENCES tb_oidc(id),
  UNIQUE KEY 	    `uk_sub` (`sub`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `tb_user` (
  `id`		 		int(10) unsigned NOT NULL AUTO_INCREMENT,
  `oidc_id`         int(10) unsigned DEFAULT NULL,
  `sub`	        	varchar(255) DEFAULT NULL,
  `email`	 		varchar(255) NOT NULL,
  `email_verified` 	enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY 		(`id`),
  CONSTRAINT       `fk_user_oidc_id` FOREIGN KEY (oidc_id) REFERENCES tb_oidc(id), /* ON DELETE SET oidc_id and sub TO NULL*/
  UNIQUE KEY 	   `uk1_sub` (`oidc_id`, `sub`),
  UNIQUE KEY 	   `uk2_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `tb_oidc_self_issued_verified` (
  `self_issued_id` int(10) unsigned NOT NULL,
  `user_id`        int(10) unsigned NOT NULL,
  PRIMARY KEY 	   (`self_issued_id`, `user_id`),
  CONSTRAINT       `fk1_oidc_self_issued_id` FOREIGN KEY (self_issued_id) REFERENCES tb_oidc_self_issued(id),
  CONSTRAINT       `fk2_user_id` FOREIGN KEY (user_id) REFERENCES tb_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `tb_user_info` (
  `id`		 		int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id`         int(10) unsigned NOT NULL,
  `provider`        varchar(255) NOT NULL,
  `display_name`	varchar(255) DEFAULT NULL,
  `given_name` 		varchar(255) DEFAULT NULL,
  `middle_name`		varchar(255) DEFAULT NULL,
  `family_name` 	varchar(255) DEFAULT NULL,
  PRIMARY KEY 		(`id`),
  CONSTRAINT       `fk_user_info_user_id` FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE CASCADE,
  UNIQUE KEY 	   `uk_user_provider` (`user_id`, `provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `tb_folder` (
  `id`        int(10) unsigned NOT NULL auto_increment,
  `owner_id`  int(10) unsigned NOT NULL,
  `mtime`     int(10) unsigned NOT NULL,
  `locked`    enum('1', '0') NOT NULL default '0',
  `hidden`    enum('1', '0') NOT NULL default '0',
  PRIMARY KEY (`id`),
  CONSTRAINT  `fk_folder_user_id` FOREIGN KEY (owner_id) REFERENCES tb_user(id) ON DELETE CASCADE
) AUTO_INCREMENT=1 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
   CONSTRAINT  `fk1_file_user_id` FOREIGN KEY (owner_id) REFERENCES tb_user(id) ON DELETE CASCADE,
   CONSTRAINT  `fk2_file_parent_id` FOREIGN KEY (parent_id) REFERENCES tb_file(id)
) AUTO_INCREMENT=1000000001 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
  CONSTRAINT  `fk1_folder_link_user_id` FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE CASCADE,
  CONSTRAINT  `fk2_folder_link_parent_id` FOREIGN KEY (parent_id) REFERENCES tb_folder(id) ON DELETE CASCADE,
  CONSTRAINT  `fk3_folder_link_folder_id` FOREIGN KEY (folder_id) REFERENCES tb_folder(id) ON DELETE CASCADE
) AUTO_INCREMENT=1001 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
  CONSTRAINT  `fk1_file_link_user_id` FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE CASCADE,
  CONSTRAINT  `fk2_file_link_parent_id` FOREIGN KEY (parent_id) REFERENCES tb_folder(id) ON DELETE CASCADE,
  CONSTRAINT  `fk3_file_link_file_id` FOREIGN KEY (file_id) REFERENCES tb_file(id) ON DELETE CASCADE
) AUTO_INCREMENT=1000001001 ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
