<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBrandsTable extends Migration
{
    public function up()
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();  // Primary Key
            $table->string('name');  // Nama brand
            $table->text('description')->nullable();  // Deskripsi brand (opsional)
            $table->timestamps();  // Waktu dibuat dan diubah
        });
    }

    public function down()
    {
        Schema::dropIfExists('brands');
    }
}
