<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Oppertunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'value',
        'stage',
        'status',
        'source',
        'assigned_to',
        'created_by',
        'notes',
        'is_won',
        'won_at',
    ];

    protected $casts = [
        'is_won' => 'boolean',
        'won_at' => 'datetime',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
