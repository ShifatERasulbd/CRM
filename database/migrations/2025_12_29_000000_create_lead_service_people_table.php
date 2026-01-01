<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lead_service_people', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained('leads')->onDelete('cascade');
            $table->foreignId('service_person_id')->constrained('service_people')->onDelete('cascade');
            $table->date('joining_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();

            // Prevent duplicate assignments
            $table->unique(['lead_id', 'service_person_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_service_people');
    }
};
