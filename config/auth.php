<?php

return [
    
    'defaults' => [
        'guard' => 'api', 
        'passwords' => 'users',
    ],
    //define how users are authenticated
    'guards' => [
        'web' => [
            'driver' => 'session',//session/cookie authentication
            'provider' => 'users',//providers-where to get users
        ],

        'api' => [
            'driver' => 'jwt', //if api jwt authentication
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class, 
        ],
    ],

    // 'passwords' => [
    //     'users' => [
    //         'provider' => 'users',
    //         'table' => 'password_reset_tokens',
    //         'expire' => 60,
    //         'throttle' => 60,
    //     ],
    // ],

    // 'password_timeout' => 10800,

];
