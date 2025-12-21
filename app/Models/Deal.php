<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'customer_id',
        'assigned_to',
        'created_by',
        'title',
        'deal_value',
        'stage',
        'probability',
        'expected_close_date',
        'description',
        'is_won',
        'is_lost',
        'closed_at',
    ];

    protected $casts = [
        'is_won' => 'boolean',
        'is_lost' => 'boolean',
        'deal_value' => 'decimal:2',
        'probability' => 'integer',
        'expected_close_date' => 'date',
        'closed_at' => 'datetime',
    ];

    public function lead() {
        return $this->belongsTo(Lead::class);
    }
    public function customer() {
        return $this->belongsTo(Customer::class);
    }
    public function assignedTo() {
        return $this->belongsTo(User::class, 'assigned_to');
    }
    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }
}
