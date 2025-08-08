<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use SoftDeletes;

    protected $fillable = ['message', 'type', 'is_published'];

    protected $dates = ['deleted_at'];
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'notification_teacher')
            ->withPivot('status')
            ->withTimestamps();
    }
    public function students()
    {
        return $this->belongsToMany(Student::class, 'notification_student')
            ->withPivot('status')
            ->withTimestamps();
    }
}
