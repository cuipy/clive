<?php
//配置文件
return [

    'log' => [
        'type' => 'File',
        'path' => LOG_PATH,
        'level' => ['log'],//log 常规日志，用于记录日志;error 错误，一般会导致程序的终止;notice 警告，程序可以运行但是还不够完美的错误
        'apart_level' => ['error','sql'],
        'file_size' =>2097152,
        'time_format' =>'c'
    ]
];