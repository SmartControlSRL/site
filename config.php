<?php 

	date_default_timezone_set('Europe/Bucharest');//or change to whatever timezone you want
	$site_url = "https://smartcontrol.zimdev.ro/";
	define('base_url','https://smartcontrol.zimdev.ro/');
	function url_slug($str, $replace=array(), $delimiter='-', $maxLength=200) {
	if( !empty($replace) ) {
		$str = str_replace((array)$replace, ' ', $str);
	}

	$clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
	$clean = preg_replace("%[^-/+|\w ]%", '', $clean);
	$clean = strtolower(trim(substr($clean, 0, $maxLength), '-'));
	$clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);

	return $clean;
}

?>
