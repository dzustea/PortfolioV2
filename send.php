<?php
// send.php — PHP email handler s využitím PHPMaileru a SMTP

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Načtení Composer autoloaderu (uprav cestu, pokud máš vendor jinde)
require 'vendor/autoload.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Metoda není povolena.']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Chybná data.']);
    exit;
}

$jmeno  = trim(strip_tags($data['name']    ?? ''));
$email  = trim(strip_tags($data['email']   ?? ''));
$zprava = trim(strip_tags($data['message'] ?? ''));

if (!$jmeno || !$email || !$zprava) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Vyplň všechna pole.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Neplatná emailová adresa.']);
    exit;
}

// Inicializace PHPMaileru
$mail = new PHPMailer(true);

try {
    // ─── NASTAVENÍ SMTP SERVERU ───
    $mail->isSMTP();                                      // Odesílat přes SMTP
    $mail->Host       = 'smtp.tvojedomena.cz';            // SMTP server (např. smtp.seznam.cz, smtp.gmail.com)
    $mail->SMTPAuth   = true;                             // Zapnout SMTP autentizaci
    $mail->Username   = 'info@tvojedomena.cz';            // Uživatelské jméno k e-mailu, ze kterého se to odesílá
    $mail->Password   = 'TvojeSilneHeslo123';             // Heslo k tomuto e-mailu
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;   // Šifrování (STARTTLS nebo ENCRYPTION_SMTPS pro SSL)
    $mail->Port       = 587;                              // Port (587 pro STARTTLS, 465 pro SSL)
    $mail->CharSet    = 'UTF-8';                          // Správné kódování pro češtinu

    // ─── ADRESÁTI ───
    // Odesílatel musí být schránka, pod kterou se přihlašuješ (kvůli SPF ochranám)
    $mail->setFrom('info@tvojedomena.cz', 'Portfolio Formulář');
    
    // Kam má e-mail dorazit (tvůj osobní e-mail)
    $mail->addAddress('filda.lochman12@gmail.com', 'Filip Lochman');
    
    // Klíčové: Když klikneš ve svém e-mailu na "Odpovědět", začneš psát rovnou klientovi
    $mail->addReplyTo($email, $jmeno);

    // ─── OBSAH E-MAILU ───
    $mail->isHTML(false); // Posíláme čistý text, na kontakt to stačí
    $mail->Subject = '[Portfolio] Zpráva od ' . $jmeno;
    
    $telo  = "Nová zpráva z portfolia\n========================\n\n";
    $telo .= "Jméno:  $jmeno\n";
    $telo .= "Email:  $email\n\n";
    $telo .= "Zpráva:\n$zprava\n";
    
    $mail->Body = $telo;

    // Odeslání
    $mail->send();
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    // V produkci raději loguj $mail->ErrorInfo, klientovi chybu neukazuj kvůli bezpečnosti
    echo json_encode(['ok' => false, 'error' => 'E-mail se nepodařilo odeslat.']);
}