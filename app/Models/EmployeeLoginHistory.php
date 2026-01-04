<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeLoginHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'login_at',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
