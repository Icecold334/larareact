'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Helper untuk format dan parsing Rupiah
const formatRupiah = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const parseNumber = (str) => parseInt(str.replace(/[^\d]/g, ''), 10) || 0;

const breadcrumbs = [{ title: 'Pembelian', href: '/pembelian' }];

export default function PembelianPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [barangList, setBarangList] = useState([]);
    const [rows, setRows] = useState([]);

    // Ambil supplier
    useEffect(() => {
        const fetchSuppliers = async () => {
            const res = await fetch('/suppliers/true');
            const data = await res.json();
            setSuppliers(data);
        };
        fetchSuppliers();
    }, []);

    // Dengarkan event supplier
    useEffect(() => {
        const handleSupplierEvent = async ({ detail }) => {
            setSelectedSupplier(detail.id);
            setRows([]); // reset dulu

            try {
                const res = await fetch(`/barang/${detail.id}`);
                const data = await res.json();
                setBarangList(data);

                // Tambah baris pertama otomatis
                setRows([
                    {
                        id: Date.now(),
                        barangId: '',
                        tipe: '',
                        warna: '',
                        jumlah: '',
                        hargaBeli: '',
                        hargaJual: '',
                    },
                ]);
            } catch (err) {
                console.error('Error fetching barang:', err);
            }
        };

        window.addEventListener('supplier', handleSupplierEvent);
        return () => window.removeEventListener('supplier', handleSupplierEvent);
    }, []);

    // Fungsi bantu
    const handleAddRow = () => {
        setRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                barangId: '',
                tipe: '',
                warna: '',
                jumlah: '',
                hargaBeli: '',
                hargaJual: '',
            },
        ]);
    };

    const handleChange = (id, field, value) => {
        setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    };

    const handleRemove = (id) => {
        setRows((prev) => prev.filter((row) => row.id !== id));
    };

    const handleSubmit = () => {
        console.log('Kirim ke server:', rows);
        // fetch('/pembelian', { method: 'POST', body: JSON.stringify(rows) })
    };

    // Validasi: hanya muncul tombol jika semua row lengkap
    const isFormValid = rows.every((row) => row.barangId && row.tipe?.trim() && row.warna?.trim() && row.jumlah && row.hargaBeli && row.hargaJual);

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Pembelian Stok">
            <Card className="space-y-6 p-6">
                {/* Supplier Picker */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Pilih Supplier</label>
                    <Select
                        onValueChange={(val) => {
                            const selected = suppliers.find((s) => s.id === val);
                            const event = new CustomEvent('supplier', { detail: selected });
                            window.dispatchEvent(event);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map((supplier) => (
                                <SelectItem key={supplier.id} value={supplier.id}>
                                    {supplier.nama}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Tabel Input */}
                {selectedSupplier && (
                    <div className="space-y-4">
                        {/* Header */}
                        <div className="text-muted-foreground grid grid-cols-7 gap-2 border-b pb-2 text-sm font-semibold">
                            <div>Nama Barang</div>
                            <div>Tipe</div>
                            <div>Warna</div>
                            <div>Jumlah</div>
                            <div>Harga Beli</div>
                            <div>Harga Jual</div>
                            <div></div>
                        </div>

                        {/* Rows */}
                        {rows.map((row) => (
                            <div key={row.id} className="grid grid-cols-7 items-center gap-2">
                                <Select value={row.barangId} onValueChange={(val) => handleChange(row.id, 'barangId', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Barang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {barangList.map((barang) => (
                                            <SelectItem key={barang.id} value={barang.id}>
                                                {barang.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input value={row.tipe} onChange={(e) => handleChange(row.id, 'tipe', e.target.value)} placeholder="Tipe" />
                                <Input value={row.warna} onChange={(e) => handleChange(row.id, 'warna', e.target.value)} placeholder="Warna" />
                                <Input
                                    type="number"
                                    value={row.jumlah}
                                    onChange={(e) => handleChange(row.id, 'jumlah', e.target.value)}
                                    placeholder="Jumlah"
                                />
                                <Input
                                    value={formatRupiah(row.hargaBeli)}
                                    onChange={(e) => handleChange(row.id, 'hargaBeli', parseNumber(e.target.value))}
                                    placeholder="Harga Beli"
                                />
                                <Input
                                    value={formatRupiah(row.hargaJual)}
                                    onChange={(e) => handleChange(row.id, 'hargaJual', parseNumber(e.target.value))}
                                    placeholder="Harga Jual"
                                />
                                <Button size="icon" variant="ghost" onClick={() => handleRemove(row.id)}>
                                    <X className="text-destructive" />
                                </Button>
                            </div>
                        ))}

                        {/* Tombol Tambah Baris & Simpan */}
                        {isFormValid && (
                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={handleAddRow}>
                                    <Plus className="mr-2 h-4 w-4" /> Tambah Baris
                                </Button>
                                <Button onClick={handleSubmit} className="bg-green-600 text-white hover:bg-green-700">
                                    Simpan
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </AppLayout>
    );
}
