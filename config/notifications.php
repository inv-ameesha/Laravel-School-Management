<?php

return [

    'default' => env('NOTIFICATION_CHANNEL', 'webpush'),

    'channels' => [
        'webpush' => [
            'driver' => 'webpush',
            'via' => NotificationChannels\WebPush\WebPushChannel::class,
        ],

        // You can add other channels here as needed
        // 'mail' => [
        //     'driver' => 'mail',
        // ],

        'database' => [
            'driver' => 'database',
        ],
    ],

];
