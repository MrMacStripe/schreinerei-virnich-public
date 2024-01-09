<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/Exception.php';

$msg = '';


//honey pot field
$honeypot = $_POST['name-of-person'];
	//check if the honeypot field is filled out. If not, send a mail.
	if( ! empty( $honeypot ) ){
		return; //you may add code here to echo an error etc.
	}else{


//Don't run this unless we're handling a form submission
if (array_key_exists('email', $_POST)) {
    date_default_timezone_set('Etc/UTC');


    //Create a new PHPMailer instance
    $mail = new PHPMailer();
    $mail->CharSet = 'UTF-8';

    //Use a fixed address in your own domain as the from address
    //**DO NOT** use the submitter's address here as it will be forgery
    //and will cause your messages to fail SPF checks
    $mail->setFrom('schreinereivirnich@mauricestuffer.com', 'Kontaktformular Schreinerei Virnich');
    $mail->addAddress('schreinereivirnich@mauricestuffer.com', 'Kontaktformular Schreinerei Virnich');
    $mail->addBCC('schreinereivirnich@mauricestuffer.com', 'Kontaktformular Schreinerei Virnich');
    $mail->addBCC($_POST['email'], $_POST['name']);


    //Put the submitter's address in a reply-to header
    //This will fail if the address provided is invalid,
    //in which case we should ignore the whole request
    if ($mail->addReplyTo($_POST['email'], $_POST['name'])) {
        $mail->Subject = 'Kontaktformular schreinerei-virnich.de';

        //Keep it simple - don't use HTML
        $mail->isHTML(true);
        //Build a simple message body
        $mail->Body = '<div style="line-height:1.25; color:#555555;"><h2>Kontaktformular schreinerei-virnich.de</h2><p>Hallo '. $_POST['name'].  '<p>Vielen Dank für Ihre Kontaktaufnahme!<br>Wir melden uns schnellstmöglich zurück.</p>
        <p><strong>Ihre Daten</strong><br>
        Sie haben mir folgende Informationen übermittelt:</p>
        <br>Name: ' . $_POST['name'] . '<br>Email:  ' . $_POST['email'] . '<br>Firma:  ' . $_POST['company'] . '<br>Telefon:  ' . $_POST['phone']. '<br>Nachricht:  ' . $_POST['message'].'<br><br>
        ---<br>
        Hinweis: Dies ist eine automatisierte Antwort.</p></div>';
        $mail->AltBody = 'Name: ' . $_POST['name'] . '<br>Email:  ' . $_POST['email'] . '<br>Telefon (optional):  ' . $_POST['phone'] .  '<br>Nachricht:  ' . $_POST['message'];
        ;

        //Send the message, check for errors
        if (!$mail->send()) {
            //The reason for failing to send will be in $mail->ErrorInfo
            //but it's unsafe to display errors directly to users - process the error, log it on your server.
            $msg = 'Sorry, something went wrong. Please try again later.';
            $newURL = 'https://schreinerei-virnich.de/kontakt-error/';
            header('Location: ' . $newURL);

        } else {
            $msg = 'Nachricht versendet! Eine Kopie wurde an Ihre E-Mail-Adresse versendet';
            $newURL = 'https://schreinerei-virnich.de/kontakt-erfolgreich/';
            header('Location: ' . $newURL);
        }
    } else {
        $msg = 'Invalid email address, message ignored.';
        $newURL = 'https://schreinerei-virnich.de/kontakt-error/';
        header('Location: ' . $newURL);

    }
}}

?>