<?php

$image = file_get_contents("php://input");
$filename = preg_replace("/[^A-Za-z0-9.-_() ]+/", "", $_SERVER['HTTP_X_FILE_NAME']);
$allowed_extensions = array("tiff", "jpg", "jpeg", "gif", "png", "bmp");
$extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

if (!in_array($extension, $allowed_extensions)) {
    echo json_encode(array("error" => "This type of file is not allowed. :("));
    return;
}

$image_url = base_convert(strval(time()), 10, 36 ).bin2hex(openssl_random_pseudo_bytes(2)).".".$extension;
file_put_contents("../uploaded_images/" . $image_url, $image);

$response = array(
    "response" => "Success! Your image is awaiting moderation."
);
echo json_encode($response);

