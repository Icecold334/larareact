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
        Schema::create('barangs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            // $table->foreignId('supplier_id')->constrained('suppliers');
            $table->string('nama');
            $table->string('slug');
            $table->string('tipe');
            $table->string('slug_tipe');
            $table->string('warna');
            $table->string('slug_warna');
            $table->string('harga_jual');
            // $table->string('harga_beli');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangs');
    }
};
