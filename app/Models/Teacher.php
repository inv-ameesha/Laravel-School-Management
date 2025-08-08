<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use NotificationChannels\WebPush\HasPushSubscriptions;

class Teacher extends Model
{
    use HasApiTokens, HasPushSubscriptions, Notifiable;
    use SoftDeletes;
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'subject_specialization',
        'employee_id',
        'date_of_joining',
        'status',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function notifications()
    {
        return $this->belongsToMany(Notification::class, 'notification_teacher')
            ->withPivot('status')
            ->withTimestamps();
    }
}
