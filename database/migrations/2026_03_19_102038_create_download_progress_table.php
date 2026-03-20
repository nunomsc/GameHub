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
        Schema::create('download_progress', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->integer('percent')->default(0);
            $table->enum('status', ['pending', 'copying', 'ready', 'error'])->default('pending');
            $table->string('error')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('version_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('download_progress');
    }
};
