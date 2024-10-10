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
        // Menghapus foreign key terlebih dahulu sebelum drop kolom
        Schema::table('products', function (Blueprint $table) {

            $table->dropColumn('quantity'); // Menghapus kolom location_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Menambahkan kembali kolom location_id dan foreign key jika rollback
        Schema::table('products', function (Blueprint $table) {
            $table->integer('quantity');
        });
    }
};
