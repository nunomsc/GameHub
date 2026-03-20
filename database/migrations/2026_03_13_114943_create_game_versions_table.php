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
        Schema::create('game_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('version');
            $table->string('file_path')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('checksum')->nullable();
            $table->string('download_url')->nullable();
            $table->text('release_notes')->nullable();
            $table->boolean('is_latest')->default(false);
            $table->timestamp('released_at')->nullable();
            $table->timestamps();

            $table->unique(['game_id', 'version']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_versions');
    }
};
