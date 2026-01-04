<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'position',
        'department',
        'joining_date',
        'end_date',
        'salary',
    ];

    /**
     * Automatically include these attributes in JSON (API response)
     */
    protected $appends = ['duration'];

    /**
     * Relation with users table (email based)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'email', 'email');
    }

    /**
     * Get duration between joining_date and end_date
     * If end_date is null, calculate till today
     */
    public function getDurationAttribute()
    {
        if (!$this->joining_date) {
            return '-';
        }

        $startDate = Carbon::parse($this->joining_date);
        $endDate   = $this->end_date
            ? Carbon::parse($this->end_date)
            : Carbon::now();

        $diff = $startDate->diff($endDate);

        return "{$diff->y}y {$diff->m}m {$diff->d}d";
    }
}
