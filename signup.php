<?php
declare(strict_types=1);
// Disabled unless a founder-approved private configuration explicitly enables it.
const CONSENT_VERSION = 'launch-v1';
const CONSENT_TEXT = 'I agree to receive emails about the .self launch and early access. I can withdraw my consent at any time.';
const MAX_AGE = 86400;
const MIN_AGE = 3;
const RATE_LIMIT = 3;
umask(0077);
ini_set('display_errors', '0');
ini_set('log_errors', '0'); // Never send request data to a default PHP log.
ini_set('expose_php', '0');
header_remove('X-Powered-By');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
header("Content-Security-Policy: default-src 'none'; style-src 'self'; img-src 'self' data:; form-action 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; script-src 'none'");
header('X-Robots-Tag: noindex, nofollow');

function respond(int $status, bool $ok = false): never {
    if (str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json')) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $ok ? 'Your interest has been recorded.' : 'We could not process that request. Please try again later.']);
    } elseif ($ok) {
        header('Location: thank-you.html', true, 303);
    } elseif (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
        header('Location: signup-error.html', true, 303);
    } else {
        http_response_code($status);
        header('Content-Type: text/html; charset=utf-8');
        readfile(__DIR__ . '/signup-error.html');
    }
    exit;
}
function isOutside(string $path, string $root): bool {
    return $path !== $root && !str_starts_with($path, $root . DIRECTORY_SEPARATOR);
}
function plain($value, int $max): ?string {
    if (!is_string($value) || strlen($value) > $max || preg_match('/[\x00-\x1F\x7F]/', $value)) return null;
    return trim($value);
}
function privateFile(string $path) {
    if (is_link($path)) throw new RuntimeException('storage');
    $handle = fopen($path, 'c+');
    if (!$handle || !chmod($path, 0600) || !flock($handle, LOCK_EX)) throw new RuntimeException('storage');
    return $handle;
}
function writeState($handle, array $state): void {
    $bytes = json_encode($state, JSON_THROW_ON_ERROR);
    if (!ftruncate($handle, 0) || !rewind($handle) || fwrite($handle, $bytes) !== strlen($bytes) || !fflush($handle)) throw new RuntimeException('storage');
}
function recordFailure(string $dir, string $code): void {
    // Codes only: never email, name, token, address, raw IP or exception text.
    try {
        $h = privateFile($dir . '/failures.log');
        fseek($h, 0, SEEK_END);
        fwrite($h, gmdate('c') . ' ' . $code . "\n");
        fflush($h); flock($h, LOCK_UN); fclose($h);
    } catch (Throwable $e) { /* No fallback that could expose submission data. */ }
}
function rateAndReplay(string $dir, string $hash, string $nonce, int $now): bool {
    $h = privateFile($dir . '/rate.json');
    try {
        $raw = stream_get_contents($h);
        $state = $raw === '' ? ['hits' => [], 'tokens' => []] : json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($state) || !isset($state['hits'], $state['tokens']) || !is_array($state['hits']) || !is_array($state['tokens'])) throw new RuntimeException('storage');
        $state['hits'] = array_values(array_filter($state['hits'], fn($hit) => ($hit['t'] ?? 0) > $now - MAX_AGE));
        $state['tokens'] = array_filter($state['tokens'], fn($time) => $time > $now - MAX_AGE);
        $hits = array_filter($state['hits'], fn($hit) => ($hit['h'] ?? '') === $hash);
        if (count($hits) >= RATE_LIMIT || isset($state['tokens'][$nonce])) { writeState($h, $state); return false; }
        $state['hits'][] = ['h' => $hash, 't' => $now];
        $state['tokens'][$nonce] = $now;
        writeState($h, $state);
        return true;
    } finally { flock($h, LOCK_UN); fclose($h); }
}

$root = realpath($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) ?: __DIR__;
$configPath = getenv('SELF_SIGNUP_CONFIG') ?: dirname(__DIR__) . '/self-private/signup-config.php';
$resolved = realpath($configPath);
if (!$resolved || !isOutside($resolved, $root) || !isOutside($resolved, __DIR__)) respond(503);
try { $config = require $resolved; } catch (Throwable $e) { respond(503); }
if (!is_array($config) || ($config['enabled'] ?? false) !== true) respond(503);
$owner = plain($config['owner_email'] ?? null, 254);
$from = plain($config['from_email'] ?? null, 254);
$origin = $config['origin'] ?? '';
$secret = $config['token_secret'] ?? '';
$salt = $config['ip_salt'] ?? '';
$dir = realpath($config['data_dir'] ?? '');
if (!$owner || !filter_var($owner, FILTER_VALIDATE_EMAIL) || !$from || !filter_var($from, FILTER_VALIDATE_EMAIL)
    || !is_string($origin) || !preg_match('~^https://[a-z0-9.-]+(?::[0-9]+)?$~D', $origin)
    || !is_string($secret) || strlen($secret) < 32 || !is_string($salt) || strlen($salt) < 32 || hash_equals($secret, $salt)
    || !$dir || !isOutside($dir, $root) || !isOutside($dir, __DIR__) || !is_writable($dir)) respond(503);
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'GET') {
    $payload = time() . '.' . bin2hex(random_bytes(16));
    $token = $payload . '.' . hash_hmac('sha256', $payload, $secret);
    header('Content-Type: text/html; charset=utf-8');
    // Native, no-JS form. A fresh signed token is minted per page view, never cached.
    $html = file_get_contents(__DIR__ . '/index.html');
    $footer = substr($html, strpos($html, '<footer class="footer wrap">'));
    $form = substr($html, strpos($html, '<form method='));
    $form = substr($form, 0, strpos($form, '</form>') + 7);
    $form = str_replace(['<fieldset disabled>', 'name="time_token" type="hidden" value=""', 'Sign-up opens after approval', 'No details are collected while sign-up is closed.'],
        ['<fieldset>', 'name="time_token" type="hidden" value="' . $token . '"', 'Keep me in the loop', 'You can withdraw consent at any time.'], $form);
    echo '<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>.self | Early access</title><link rel="stylesheet" href="style.css"><link rel="icon" href="assets/favicon.svg"></head><body><a class="skip" href="#main">Skip to content</a><header class="header wrap"><a class="logo" href="index.html" aria-label=".self home"><img src="assets/badge-slant.svg" alt=".self" width="44" height="44"></a></header><main id="main" tabindex="-1" class="document wrap"><h1>Be here from<br><em>the beginning.</em></h1><p id="signup-status" role="status" aria-live="polite">Hear about the .self launch and early access. Please take a moment to read the privacy notice before signing up.</p><div class="form-card">' . $form . '</div></main>' . $footer;
    exit;
}
if ($method !== 'POST') { header('Allow: GET, POST'); respond(405); }
$submittedOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
// Browser POSTs supply Origin. With no-referrer policy, Referer is intentionally not used.
if (!hash_equals($origin, $submittedOrigin) || (isset($_SERVER['HTTP_SEC_FETCH_SITE']) && $_SERVER['HTTP_SEC_FETCH_SITE'] !== 'same-origin')) respond(403);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 4096) respond(413);
$token = plain($_POST['time_token'] ?? null, 180);
if (!$token || !preg_match('/^(\d{10})\.([a-f0-9]{32})\.([a-f0-9]{64})$/D', $token, $parts)) respond(403);
$now = time(); $age = $now - (int)$parts[1];
if ($age < MIN_AGE || $age > MAX_AGE || !hash_equals(hash_hmac('sha256', $parts[1] . '.' . $parts[2], $secret), $parts[3])) respond(403);
$honeypot = plain($_POST['website'] ?? '', 200);
$email = plain($_POST['email'] ?? null, 254);
$name = plain($_POST['first_name'] ?? '', 80);
if ($honeypot !== '' || !$email || !filter_var($email, FILTER_VALIDATE_EMAIL) || $name === null || preg_match('//u', $name) !== 1
    || ($_POST['consent'] ?? '') !== CONSENT_VERSION) respond(422);
try {
    // REMOTE_ADDR only. Never trust user-supplied proxy headers.
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    if (!filter_var($ip, FILTER_VALIDATE_IP)) respond(503);
    $hash = hash_hmac('sha256', $ip, $salt); unset($ip);
    if (!rateAndReplay($dir, $hash, hash('sha256', $parts[2]), $now)) respond(429);
    // Persist before mail. JSON Lines prevents spreadsheet formula execution.
    $line = json_encode(['timestamp' => gmdate('c'), 'email' => $email, 'name' => $name, 'consent_version' => CONSENT_VERSION], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE) . "\n";
    $h = privateFile($dir . '/interest.jsonl');
    try {
        if (fseek($h, 0, SEEK_END) !== 0 || fwrite($h, $line) !== strlen($line) || !fflush($h)) throw new RuntimeException('storage');
    } finally { flock($h, LOCK_UN); fclose($h); }
    $headers = ['From' => $from, 'Content-Type' => 'text/plain; charset=UTF-8'];
    // User fields go in the body only, never into email headers.
    $body = "New .self launch interest\nEmail: " . $email . "\nFirst name: " . $name . "\nConsent: " . CONSENT_VERSION . "\n" . CONSENT_TEXT;
    try { $sent = @mail($owner, '.self launch interest', $body, $headers); } catch (Throwable $e) { $sent = false; }
    if (!$sent) recordFailure($dir, 'mail_failed_interest_saved');
    respond(200, true);
} catch (Throwable $e) { recordFailure($dir, 'storage_failed'); respond(503); }
