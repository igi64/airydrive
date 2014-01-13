CREATE VIEW vw_folder_file AS
SELECT  fldl.folder_id AS `id`,
		fldl.user_id AS `user_id`,
        fldl.parent_id AS `parent_id`,
		fldl.name AS `name`,
		'directory' AS `mime`,
		0 AS `size`,
		fld.mtime AS `mtime`,
		fldl.mtime AS `mtimel`,
		fldl.read AS `read`,
		fldl.write AS `write`,
		fld.locked AS `locked`,
		fld.hidden AS `hidden`,
		0 AS `width`,
		0 AS `height`
FROM tb_folder_link fldl 
		LEFT JOIN tb_user AS usr ON usr.id=fldl.user_id
		LEFT JOIN tb_folder AS fld ON fld.id=fldl.folder_id
UNION ALL
SELECT  fll.file_id AS `id`,
		fll.user_id AS `user_id`,
        fll.parent_id AS `parent_id`,
		fll.name AS `name`,
		fl.mime AS `mime`,
		fl.size AS `size`,
		fl.mtime AS `mtime`,
		fll.mtime AS `mtimel`,
		fll.read AS `read`,
		fll.write AS `write`,
		fl.locked AS `locked`,
		fl.hidden AS `hidden`,
		0 AS `width`,
		0 AS `height`
FROM    tb_file_link fll 
		LEFT JOIN tb_user AS usr ON usr.id=fll.user_id
		LEFT JOIN tb_file AS fl ON fl.id=fll.file_id;