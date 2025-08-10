<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use NotificationChannels\WebPush\WebPushMessage;
//ShouldQueue - notifications must be queued instead of senting it immediately
//Notification - inbuilt laravel class
class PushStudentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $message;//wht all needs to be stored for a notification
    //protected - could be used in that class or subcls only

    public function __construct($message)
    {
        $this->message = $message;
    }
    //via method defines through which channel the message needs to be notified
    public function via($notifiable)
    {
        return ['webpush'];//here it must be wepush channel
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)//notification generation
            ->title('Student Notification')
            ->body($this->message)
            ->action('View', 'view_notification');
    }
}
