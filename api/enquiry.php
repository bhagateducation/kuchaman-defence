<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, string $message): void {
    http_response_code($status);
    echo json_encode(['ok' => $status === 200, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, 'Only POST requests are accepted.');
}

$field = static function (string $key): string {
    $value = $_POST[$key] ?? '';
    return is_string($value) ? trim($value) : '';
};
$nameField = $_POST['names_1'] ?? [];
$name = is_array($nameField) && is_string($nameField['first_name'] ?? null)
    ? trim($nameField['first_name']) : '';
$mobile = $field('numeric_field');
$email = $field('email');
$course = $field('department');
$message = $field('description');
$source = $field('source_page');

if ($name === '' || strlen($name) > 120 || !preg_match('/^[+()0-9\s-]{8,18}$/', $mobile)
    || $course === '' || strlen($course) > 150 || strlen($message) > 3000
    || ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL))) {
    respond(422, 'Please check your name, mobile number, course, and email address.');
}

$clean = static fn(string $value): string => preg_replace('/[\x00-\x1F\x7F]/u', ' ', $value) ?? '';
$body = "New Kuchaman Defence Academy enquiry\n\n"
    . "Name: " . $clean($name) . "\n"
    . "Mobile: " . $clean($mobile) . "\n"
    . "Email: " . $clean($email) . "\n"
    . "Course: " . $clean($course) . "\n"
    . "Message: " . $clean($message) . "\n"
    . "Page: " . $clean($source) . "\n";

$headers = [
    'From: KDA Website <no-reply@kuchamandefenceacademy.in>',
    'Content-Type: text/plain; charset=UTF-8',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

if (!@mail('kuchamandefence@gmail.com', 'New website enquiry', $body, implode("\r\n", $headers))) {
    error_log('KDA enquiry mail delivery failed');
    respond(503, 'The enquiry could not be delivered right now.');
}

respond(200, 'Your enquiry has been sent.');
