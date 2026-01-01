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
        Schema::table('leads', function (Blueprint $table) {
            $table->foreignId('reference_by_customer')
                ->nullable()
                ->constrained('leads')
                ->nullOnDelete();
            $table->string('reference_by_staff')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropForeign(['reference_by_customer']);
            $table->dropColumn(['reference_by_customer', 'reference_by_staff']);
        });
    }
};
