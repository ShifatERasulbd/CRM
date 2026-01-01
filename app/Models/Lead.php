<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'company',
        'status',
        'source',
        'service_id',
        'assigned_to',
        'created_by',
        'notes',
        'is_converted',
        'converted_at',
        'reference_by_customer',
        'reference_by_staff',
    ];

    protected $casts = [
        'is_converted' => 'boolean',
        'converted_at' => 'datetime',
    ];

    /**
     * Get the service for this lead
     */
    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    /**
     * Get the user who created this lead
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user this lead is assigned to
     */
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
    /**
     * Get the service person assigned to this lead/customer
     */
    public function servicePerson()
    {
        return $this->belongsTo(ServicePerson::class, 'service_person_id');
    }

    /**
     * Get the lead service people
     */
    public function leadServicePeople()
    {
        return $this->hasMany(LeadServicePerson::class);
    }
}
