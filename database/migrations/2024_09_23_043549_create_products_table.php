<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {

            $table->foreignId('brand_id')->constrained()->onDelete('cascade');  // Brand produk
            $table->string('type');  // Tipe produk

        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }
}
