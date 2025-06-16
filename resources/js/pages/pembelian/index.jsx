'use client';

import { router } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import DispatchAlert from '@/components/dispatch-alert';
import AppLayout from '@/layouts/app-layout';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formatRupiah = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const parseNumber = (str) => parseInt(str.replace(/[^\d]/g, ''), 10) || 0;

const HargaInput = ({ value, onChange, placeholder }) => (
    <div className="border-input bg-background focus-within:ring-ring focus-within:border-ring flex h-10 w-full items-center rounded-md border px-3 text-sm shadow-sm focus-within:ring-1">
        <span className="text-muted-foreground mr-2">Rp</span>
        <input
            type="text"
            inputMode="numeric"
            className="w-full border-none bg-transparent outline-none focus-visible:ring-0"
            value={value ? formatRupiah(value).replace(/^Rp\s?/, '') : ''}
            onChange={(e) => onChange(parseNumber(e.target.value))}
            placeholder={placeholder}
        />
    </div>
);

const breadcrumbs = [{ title: 'Pembelian', href: '/pembelian' }];

export default function PembelianPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [barangList, setBarangList] = useState([]);
    const [rows, setRows] = useState([]);
    const [focusedRow, setFocusedRow] = useState(null);

    useEffect(() => {
        const fetchSuppliers = async () => {
            const res = await fetch('/suppliers/true');
            const data = await res.json();
            setSuppliers(data);
        };
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const handleSupplierEvent = async ({ detail }) => {
            setSelectedSupplier(detail.id);
            setRows([]);

            try {
                const res = await fetch(`/barang/supp/${detail.id}`);
                const data = await res.json();
                setBarangList(data);
                setRows([
                    {
                        id: Date.now(),
                        nama: '',
                        tipe: '',
                        warna: '',
                        jumlah: '',
                        hargaBeli: '',
                        pajakPersen: '',
                    },
                ]);
            } catch (err) {
                console.error('Error fetching barang:', err);
            }
        };

        window.addEventListener('supplier', handleSupplierEvent);
        return () => window.removeEventListener('supplier', handleSupplierEvent);
    }, []);

    const handleAddRow = () => {
        setRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                nama: '',
                tipe: '',
                warna: '',
                jumlah: '',
                hargaBeli: '',
                pajakPersen: '',
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
        const data = {
            supplier_id: selectedSupplier,
            rows,
        };

        router.post(`/beli`, data, {
            onSuccess: () => {
                DispatchAlert({ status: true, obj: 'Pembelian', text: 'disimpan' });
                setBarangList([]);
                setRows([
                    {
                        id: Date.now(),
                        nama: '',
                        tipe: '',
                        warna: '',
                        jumlah: '',
                        hargaBeli: '',
                        hargaJual: '', // ← tambah ini
                        pajakPersen: '',
                    },
                ]);
            },
            onError: () => {
                DispatchAlert({ status: false, obj: 'Pembelian', text: 'disimpan' });
            },
        });
    };

    const isFormValid = rows.every(
        (row) => row.nama && row.tipe?.trim() && row.warna?.trim() && row.jumlah && row.hargaBeli && row.hargaJual && row.pajakPersen !== '',
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Pembelian Stok">
            <Card className="space-y-6 overflow-visible p-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Pilih Supplier</label>
                    <Select
                        value={selectedSupplier?.toString()}
                        onValueChange={(val) => {
                            const selected = suppliers.find((s) => s.id.toString() === val);
                            const event = new CustomEvent('supplier', { detail: selected });
                            window.dispatchEvent(event);
                            setSelectedSupplier(selected.id);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map((supplier) => (
                                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                    {supplier.nama}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedSupplier && (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Barang</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Warna</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Harga Beli</TableHead>
                                    <TableHead>Harga Jual</TableHead>
                                    <TableHead>Pajak (%)</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <Input
                                                value={row.nama}
                                                onChange={(e) => handleChange(row.id, 'nama', e.target.value)}
                                                placeholder="Ketik nama barang"
                                                onFocus={() => setFocusedRow(row.id)}
                                                onBlur={() => setTimeout(() => setFocusedRow(null), 200)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={row.tipe}
                                                onChange={(e) => handleChange(row.id, 'tipe', e.target.value)}
                                                placeholder="Tipe"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={row.warna}
                                                onChange={(e) => handleChange(row.id, 'warna', e.target.value)}
                                                placeholder="Warna"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={row.jumlah}
                                                onChange={(e) => handleChange(row.id, 'jumlah', e.target.value)}
                                                placeholder="Jumlah"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <HargaInput
                                                value={row.hargaBeli}
                                                onChange={(val) => handleChange(row.id, 'hargaBeli', val)}
                                                placeholder="Harga Beli"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <HargaInput
                                                value={row.hargaJual}
                                                onChange={(val) => handleChange(row.id, 'hargaJual', val)}
                                                placeholder="Harga Jual"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={row.pajakPersen}
                                                onChange={(e) => handleChange(row.id, 'pajakPersen', e.target.value)}
                                                placeholder="Pajak"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {rows.length > 1 && (
                                                <Button size="icon" variant="ghost" onClick={() => handleRemove(row.id)}>
                                                    <X className="text-destructive" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

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
                    </>
                )}
            </Card>
        </AppLayout>
    );
}
