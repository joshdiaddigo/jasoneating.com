<?php 
$dir    = './images/';
$images = scandir($dir);
echo json_encode($images);
?>