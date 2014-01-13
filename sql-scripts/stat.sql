SELECT  fldl.folder_id AS `id`,
		fldl.user_id AS `user_id`,
        fldl.parent_id AS `parent_id`,
		fldl.name AS `name`,
		'directory' AS `mime`,
		0 AS `size`,
		fld.mtime AS `ts`,
		fldl.mtime AS `tsl`,
		fldl.read AS `read`,
		fldl.write AS `write`,
		fld.locked AS `locked`,
		fld.hidden AS `hidden`,
		0 AS `width`,
		0 AS `height`,
		IF (fldlch.id, 1, 0) AS dirs 
FROM tb_folder_link fldl 
		LEFT JOIN tb_folder_link AS fldp ON fldp.folder_id=fldl.parent_id
		LEFT JOIN tb_folder_link AS fldlch ON fldlch.parent_id=fldl.folder_id
		LEFT JOIN tb_user AS usr ON usr.id=fldl.user_id
		LEFT JOIN tb_folder AS fld ON fld.id=fldl.folder_id
WHERE fldl.folder_id = '1' AND usr.email = 'izboran@gmail.com'
GROUP BY fldl.folder_id /*exclude this line in view*/
UNION ALL
SELECT  fll.file_id AS `id`,
		fll.user_id AS `user_id`,
        fll.parent_id AS `parent_id`,
		fll.name AS `name`,
		fl.mime AS `mime`,
		fl.size AS `size`,
		fl.mtime AS `ts`,
		fll.mtime AS `tsl`,
		fll.read AS `read`,
		fll.write AS `write`,
		fl.locked AS `locked`,
		fl.hidden AS `hidden`,
		0 AS `width`,
		0 AS `height`,
		0 AS dirs 
FROM    tb_file_link fll 
		LEFT JOIN tb_user AS usr ON usr.id=fll.user_id
		LEFT JOIN tb_file AS fl ON fl.id=fll.file_id
WHERE fl.id = '1' AND usr.email = 'izboran@gmail.com';
