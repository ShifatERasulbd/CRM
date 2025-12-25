<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicePerson extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'email',
        'present_address',
        'permanent_address',
        'photo',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
    ];
}
