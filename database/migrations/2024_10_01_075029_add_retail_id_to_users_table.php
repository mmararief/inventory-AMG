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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('retail_id')->nullable()->after('id');

            // Jika Anda ingin menambahkan foreign key constraint, uncomment baris berikut:
            $table->foreign('retail_id')->references('id')->on('retails')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Jika Anda menambahkan foreign key constraint, hapus terlebih dahulu:
            $table->dropForeign(['retail_id']);

            $table->dropColumn('retail_id');
        });
    }
};
