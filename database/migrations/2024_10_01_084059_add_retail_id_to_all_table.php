<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        $tables = [
            'brands',
            'categories',
            'inventory',
            'locations',
            'products',
            'stock_movements',
            'suppliers',
            'types'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->unsignedBigInteger('retail_id')->nullable();
                $table->foreign('retail_id')->references('id')->on('retails')->onDelete('cascade');
            });
        }
    }

    public function down()
    {
        $tables = [
            'brands',
            'categories',
            'inventory',
            'locations',
            'products',
            'stock_movements',
            'suppliers',
            'types'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropForeign(['retail_id']);
                $table->dropColumn('retail_id');
            });
        }
    }
};
