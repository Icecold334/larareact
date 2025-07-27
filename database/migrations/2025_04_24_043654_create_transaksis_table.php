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
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            $table->string('kode');
            $table->boolean('jenis');
            $table->foreignId('barang_id')->constrained('barangs');
            $table->foreignId('supplier_id')->constrained('suppliers');
            $table->integer('jumlah');
            $table->integer('harga_jual')->nullable();
            $table->decimal('pajak_persen', 5, 2)->nullable(); // ← tambahkan untuk pajak per item
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
