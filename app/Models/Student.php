<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use NotificationChannels\WebPush\HasPushSubscriptions;
class Student extends Model
{
    use HasApiTokens, HasPushSubscriptions, Notifiable;
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone', 
        'roll_number',
        'class',
        'dob', 
        'admission_date',
        'status',
        'teacher_id',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    public function notifications()
    {
        return $this->belongsToMany(Notification::class, 'notification_student')
            ->withPivot('status')
            ->withTimestamps();
    }
}
