INSERT INTO `tb_oidc`
(`id`, `issuer`,                 `provider`, `registration`) VALUES 
('1',  'https://self-issued.me', '
{
   "authorization_endpoint":
     "openid:",
   "issuer":
     "https://self-issued.me",
   "scopes_supported":
     ["openid", "profile", "email", "address", "phone"],
   "response_types_supported":
     ["id_token"],
   "subject_types_supported":
     ["pairwise"],
   "id_token_signing_alg_values_supported":
     ["RS256"],
   "request_object_signing_alg_values_supported":
     ["none", "RS256"],
   "registration_endpoint":
     "https://self-issued.me/connect/register.php"
  }',
  '{
  
  }'
); 

INSERT INTO `tb_user`
(`id`, `email`            ) VALUES 
('1',  'izboran@gmail.com'); 

INSERT INTO `tb_user_info`
(`id`, `user_id`, `provider`, `display_name`, `given_name`, `family_name`) VALUES 
('1',  '1',       'google',   'Igor Zboran',  'Igor',       'Zboran'); 

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

INSERT INTO `tb_folder_link`
(`id`,   `user_id`, `parent_id`, `folder_id`, `name`,        `mtime`,      `read`, `write`) VALUES 
('1001', '1',        NULL,       '1',         'Shared',     '1383930510', '1',    '1');
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
