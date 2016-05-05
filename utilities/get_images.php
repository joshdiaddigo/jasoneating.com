<?php 
$dir    = '../images/';
$images = scandir($dir);
sort($images);
$images = array_reverse($images);
echo json_encode($images);
