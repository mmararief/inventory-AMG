<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRetailsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('retails', function (Blueprint $table) {
            $table->id();  // Primary key
            $table->string('retail_name');  // Nama retail
            $table->string('address');  // Alamat retail
            $table->string('kecamatan');  // Kecamatan
            $table->string('kelurahan');  // Kelurahan
            $table->string('city');  // Kota
            $table->string('province');  // Provinsi
            $table->string('country');  // Negara
            $table->string('postal_code');  // Kode Pos
            $table->string('handphone');  // Nomor handphone
            $table->string('email')->unique();  // Email (harus unik)
            $table->string('google_maps_link')->nullable();  // Link Google Maps (nullable)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retails');
    }
}
