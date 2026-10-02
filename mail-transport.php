<?php
declare(strict_types=1);
// SMTP settings are supplied only by private config; never expose server replies.
function self_smtp_response($socket, array $expected): string {
    $response = ''; $lines = 0;
    while (($line = fgets($socket, 4096)) !== false) {
        $response .= $line;
        if (++$lines > 100 || strlen($response) > 65536) throw new RuntimeException('smtp_response_limit');
        if (preg_match('/^\d{3} /', $line)) break;
    }
    if ($response === '' || !preg_match('/^\d{3} /', $line ?: '')) throw new RuntimeException('smtp_no_response');
    $code = (int)substr($line, 0, 3);
    if (!in_array($code, $expected, true)) throw new RuntimeException('smtp_response_' . $code);
    return $response;
}
function self_smtp_write($socket, string $data): void {
    $offset = 0;
    while ($offset < strlen($data)) {
        $written = fwrite($socket, substr($data, $offset));
        if ($written === false || $written === 0) throw new RuntimeException('smtp_write_failed');
        $offset += $written;
    }
}
function self_smtp_command($socket, string $command, array $expected): string {
    self_smtp_write($socket, $command . "\r\n");
    return self_smtp_response($socket, $expected);
}
function self_send_smtp(array $smtp, string $recipient, string $subject, string $body, string $replyTo): string {
    $host = (string)($smtp['host'] ?? ''); $port = (int)($smtp['port'] ?? 587);
    $username = (string)($smtp['username'] ?? ''); $password = (string)($smtp['password'] ?? '');
    $from = (string)($smtp['from'] ?? $username);
    if ($host === '' || !preg_match('/^[a-zA-Z0-9.-]+$/D', $host) || !in_array($port,[465,587],true) || $username === '' || $password === '') throw new RuntimeException('smtp_config_invalid');
    foreach ([$from,$recipient,$replyTo] as $address) if (!filter_var($address,FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/',$address)) throw new RuntimeException('smtp_address_invalid');
    if (preg_match('/[\r\n]/',$subject)) throw new RuntimeException('smtp_subject_invalid');
    $context = stream_context_create(['ssl'=>['peer_name'=>$host,'SNI_enabled'=>true,'verify_peer'=>true,'verify_peer_name'=>true]]);
    $socket = @stream_socket_client(($port===465?'ssl://':'tcp://').$host.':'.$port,$errno,$error,20,STREAM_CLIENT_CONNECT,$context);
    if (!is_resource($socket)) throw new RuntimeException('smtp_connect_failed');
    try {
        stream_set_timeout($socket,20); self_smtp_response($socket,[220]);
        $senderDomain = substr(strrchr($from,'@'),1);
        self_smtp_command($socket,'EHLO '.$senderDomain,[250]);
        if ($port!==465) {
            self_smtp_command($socket,'STARTTLS',[220]);
            if (!@stream_socket_enable_crypto($socket,true,STREAM_CRYPTO_METHOD_TLS_CLIENT)) throw new RuntimeException('smtp_tls_failed');
            self_smtp_command($socket,'EHLO '.$senderDomain,[250]);
        }
        self_smtp_command($socket,'AUTH LOGIN',[334]);
        self_smtp_command($socket,base64_encode($username),[334]);
        self_smtp_command($socket,base64_encode($password),[235]);
        self_smtp_command($socket,'MAIL FROM:<'.$from.'>',[250]);
        self_smtp_command($socket,'RCPT TO:<'.$recipient.'>',[250,251]);
        self_smtp_command($socket,'DATA',[354]);
        $headers=['Date: '.date(DATE_RFC2822),'Message-ID: <'.bin2hex(random_bytes(16)).'@'.$senderDomain.'>','From: .self <'.$from.'>','To: <'.$recipient.'>','Reply-To: <'.$replyTo.'>','Subject: =?UTF-8?B?'.base64_encode($subject).'?=','MIME-Version: 1.0','Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: quoted-printable'];
        $encoded = quoted_printable_encode(str_replace(["\r\n","\r"],"\n",$body));
        $encoded = str_replace(["\r\n","\r"],"\n",$encoded); $encoded = str_replace("\n","\r\n",$encoded);
        $message = implode("\r\n",$headers)."\r\n\r\n".$encoded;
        $message = preg_replace('/(?m)^\./','..',$message);
        self_smtp_write($socket,$message."\r\n.\r\n");
        $accepted = self_smtp_response($socket,[250]);
        // Acceptance is final; a failed QUIT must not cause duplicate sending.
        try { self_smtp_command($socket,'QUIT',[221]); } catch (Throwable $ignored) {}
        return $accepted;
    } finally { fclose($socket); }
}
