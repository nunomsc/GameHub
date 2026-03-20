<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('download_progress', function (Blueprint $table) {
            $table->unsignedBigInteger('version_id')->nullable()->after('key');
        });
    }

    public function down(): void
    {
        Schema::table('download_progress', function (Blueprint $table) {
            $table->dropColumn('version_id');
        });
    }
};