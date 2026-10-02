<?php
// CLI-only daily maintenance. Deploy outside the website’s public directory, never as a web endpoint.
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
umask(0077);
$config = require __DIR__ . '/signup-config.php';
$path = $config['data_dir'] . '/rate.json';
if (!is_file($path)) exit;
if (is_link($path)) exit(1);
$h = fopen($path, 'c+');
if (!$h || !flock($h, LOCK_EX)) exit(1);
try {
    $state = json_decode(stream_get_contents($h), true, 512, JSON_THROW_ON_ERROR);
    $cutoff = time() - 86400;
    $state['hits'] = array_values(array_filter($state['hits'], fn($hit) => ($hit['t'] ?? 0) > $cutoff));
    $state['tokens'] = array_filter($state['tokens'], fn($t) => $t > $cutoff);
    $bytes = json_encode($state, JSON_THROW_ON_ERROR);
    if (!ftruncate($h, 0) || !rewind($h) || fwrite($h, $bytes) !== strlen($bytes) || !fflush($h)) exit(1);
    chmod($path, 0600);
} finally { flock($h, LOCK_UN); fclose($h); }
