<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadServicePerson extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'service_person_id',
        'joining_date',
        'end_date',
    ];

    protected $casts = [
        'joining_date' => 'date',
        'end_date' => 'date',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function servicePerson()
    {
        return $this->belongsTo(ServicePerson::class);
    }
}
