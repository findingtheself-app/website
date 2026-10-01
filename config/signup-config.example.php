<?php
// Template only. Copy OUTSIDE public_html as self-private/signup-config.php.
// [PLACEHOLDER] Configure all values privately after approval; never commit secrets.
return [
    'enabled' => false,
    'owner_email' => 'OWNER_EMAIL',
    'from_email' => 'FROM_EMAIL',
    'origin' => '',
    'token_secret' => '', // Generate independently with random_bytes(32), encode as hex.
    'ip_salt' => '', // Generate independently; different from token_secret.
    'data_dir' => '/ABSOLUTE/PRIVATE/PATH/self-private/data',
];
