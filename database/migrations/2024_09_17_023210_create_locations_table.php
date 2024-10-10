<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocationsTable extends Migration
{
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama rak atau lokasi penyimpanan
            $table->string('description')->nullable(); // Deskripsi tambahan
            $table->timestamps();
        });

        // Menambahkan kolom location_id ke tabel produk
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('set null');
        });
    }

    public function down()
    {
        // Drop kolom location_id dari tabel produk
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn('location_id');
        });
    }
}
