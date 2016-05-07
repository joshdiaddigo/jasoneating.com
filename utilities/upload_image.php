<?php
require_once("../lib/Twilio.php");
require_once("auth.php");

$image = file_get_contents("php://input");
$filename = preg_replace("/[^A-Za-z0-9.-_() ]+/", "", $_SERVER['HTTP_X_FILE_NAME']);
$allowed_extensions = array("tiff", "jpg", "jpeg", "gif", "png", "bmp");
$extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

if (!in_array($extension, $allowed_extensions)) {
    echo json_encode(array("error" => "This type of file is not allowed. :("));
    return;
}

$image_url = base_convert(strval(time()), 10, 36 ).bin2hex(openssl_random_pseudo_bytes(32)).".".$extension;
file_put_contents("../uploaded_images/" . $image_url, $image);

$client = new Services_Twilio($TWILIO_ACCOUNT_SID, $TWILIO_AUTH_TOKEN);
$textMessage = $client->account->messages->create(array(
    "From" => "770-691-2047",
    "To" => "770-377-4047",
    "MediaUrl" => "http://jasoneating.com/beta/uploaded_images/".$image_url,
    "Body" => $image_url,
));

$response = array(
    "response" => "Your image is awaiting moderation."
);
echo json_encode($response);

