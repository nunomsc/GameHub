<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_create_system_requirements_table.php
    public function up(): void
    {
        Schema::create('system_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('platform_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->enum('type', ['minimum', 'recommended'])->default('minimum');
            $table->string('os_version')->nullable();
            $table->string('cpu')->nullable();
            $table->unsignedInteger('ram_gb')->nullable();
            $table->string('gpu')->nullable();
            $table->unsignedInteger('storage_gb')->nullable();
            $table->string('directx')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['game_id', 'platform_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_requirements');
    }
};
