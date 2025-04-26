'use client';

import DispatchAlert from '@/components/dispatch-alert';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

import { Eye, Pencil } from 'lucide-react';
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

export default function Show() {
    const { props } = usePage();
    const { barang } = props;
    const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [supplierTransactions, setSupplierTransactions] = useState([]);
    const handleOpenSupplierDialog = async (supplier) => {
        setSelectedSupplier(supplier);
        setOpenSupplierDialog(true);

        try {
            const response = await fetch(`/laporan/history/${barang.id}/${supplier.id}`);
            const data = await response.json();
            setSupplierTransactions(data);
        } catch (error) {
            console.error('Error fetching supplier transactions:', error);
        }
    };

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        nama: barang.nama,
        tipe: barang.tipe,
        warna: barang.warna,
        harga_jual: barang.harga_jual,
    });

    const handleSubmit = () => {
        router.put(`/barang/${barang.id}`, form, {
            onSuccess: () => {
                setOpen(false);
                DispatchAlert({ status: true, obj: 'Pembelian', text: 'disimpan' });
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Daftar Barang', href: '/barang' },
                { title: barang.nama, href: `/barang/${barang.id}` },
            ]}
            title="Detail Barang"
        >
            <div className="grid grid-cols-1 gap-6">
                {/* Tombol kembali */}
                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => history.back()}>
                        Kembali
                    </Button>
                </div>

                {/* Grid 2 kolom, card di kiri */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="relative p-6">
                        <h2 className="mb-6 text-2xl font-bold">Detail Barang</h2>

                        {/* Tombol edit */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="absolute top-4 right-4">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Barang</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div>
                                        <Label>Nama Barang</Label>
                                        <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Tipe</Label>
                                        <Input value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Warna</Label>
                                        <Input value={form.warna} onChange={(e) => setForm({ ...form, warna: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Harga Jual</Label>
                                        <HargaInput
                                            value={form.harga_jual}
                                            onChange={(val) => setForm({ ...form, harga_jual: val })}
                                            placeholder="Harga Jual"
                                        />
                                    </div>

                                    <div>
                                        <Label>Kode Barang (UUID)</Label>
                                        <Input value={barang.uuid} readOnly className="bg-muted cursor-not-allowed" />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button onClick={handleSubmit}>Simpan</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="text-muted-foreground font-medium">Nama Barang</TableCell>
                                    <TableCell>{barang.nama}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-muted-foreground font-medium">Kode Barang</TableCell>
                                    <TableCell>{barang.uuid}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-muted-foreground font-medium">Tipe</TableCell>
                                    <TableCell>{barang.tipe}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-muted-foreground font-medium">Warna</TableCell>
                                    <TableCell>{barang.warna}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-muted-foreground font-medium">Harga Jual</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                        }).format(barang.harga_jual)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Empty column for spacing */}
                    <div className="hidden md:block" />
                </div>

                {/* Supplier list */}
                <Card className="p-6">
                    <h2 className="mb-6 text-2xl font-bold">Supplier Terkait</h2>

                    {barang.suppliers?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Supplier</TableHead>
                                        <TableHead>Harga Beli</TableHead>
                                        <TableHead>Stok</TableHead>
                                        <TableHead className="text-right" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {barang.suppliers.map((supplier) => (
                                        <TableRow key={supplier.id}>
                                            <TableCell>{supplier.nama}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                }).format(supplier.pivot.harga_beli)}
                                            </TableCell>
                                            <TableCell>{supplier.stok ?? 0}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenSupplierDialog(supplier)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center">Belum ada supplier terkait.</p>
                    )}
                </Card>
                <Dialog open={openSupplierDialog} onOpenChange={setOpenSupplierDialog}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Riwayat Transaksi - {selectedSupplier?.nama}</DialogTitle>
                        </DialogHeader>

                        {supplierTransactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Kode</TableHead>
                                            <TableHead>Jenis</TableHead>
                                            <TableHead>Jumlah</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {supplierTransactions.map((trx) => (
                                            <TableRow key={trx.id}>
                                                <TableCell>{trx.kode}</TableCell>
                                                <TableCell>{trx.jenis ? 'Masuk' : 'Keluar'}</TableCell>
                                                <TableCell>{trx.jumlah}</TableCell>
                                                <TableCell>{new Date(trx.created_at).toLocaleString('id-ID')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center">Tidak ada transaksi.</p>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
