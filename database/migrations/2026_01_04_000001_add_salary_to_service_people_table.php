<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_people', function (Blueprint $table) {
            $table->decimal('salary', 12, 2)->nullable()->after('emergency_contact_relation');
        });
    }

    public function down(): void
    {
        Schema::table('service_people', function (Blueprint $table) {
            $table->dropColumn('salary');
        });
    }
};
