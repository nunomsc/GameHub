<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// database/migrations/xxxx_create_installs_table.php
public function up(): void
{
    Schema::create('installs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('game_id')
              ->constrained()
              ->cascadeOnDelete();
        $table->foreignId('version_id')
              ->constrained('game_versions')
              ->cascadeOnDelete();
        $table->string('machine_id');
        $table->string('machine_name')->nullable();
        $table->enum('status', [
            'pending',
            'downloading',
            'installed',
            'failed',
            'uninstalled'
        ])->default('pending');
        $table->string('install_path')->nullable();
        $table->timestamp('installed_at')->nullable();
        $table->timestamps();

        $table->unique(['game_id', 'machine_id']);
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installs');
    }
};
