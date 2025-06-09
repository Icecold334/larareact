'use client';

import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

function formatRupiah(value) {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
}

const breadcrumbs = [
    {
        title: 'Arus Kas',
        href: '/kas',
    },
];

export default function ArusKasPage({ kas = [], saldo = 0 }) {
    const [openDialog, setOpenDialog] = useState(false);

    function getLocalDatetime() {
        const now = new Date();
        const offset = now.getTimezoneOffset(); // in minutes
        const localDate = new Date(now.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
    }

    const { data, setData, post, reset } = useForm({
        jenis: 'masuk',
        nominal: '',
        tanggal: '',
        keterangan: '',
    });

    const [formError, setFormError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const nominalInt = parseInt(data.nominal || '0');

        if (data.jenis === 'keluar' && nominalInt > saldo) {
            setFormError('Nominal pengeluaran tidak boleh melebihi saldo saat ini.');
            return;
        }

        setFormError('');
        post('/kas', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Arus Kas">
            <Head title="Arus Kas" />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Saldo Saat Ini</h1>
                    <p className="text-xl font-semibold text-green-600">Rp {saldo.toLocaleString('id-ID')}</p>
                </div>

                {/* Tambah Transaksi */}
                <Dialog
                    open={openDialog}
                    onOpenChange={(isOpen) => {
                        setOpenDialog(isOpen);
                        if (isOpen) {
                            setData({
                                jenis: 'masuk',
                                nominal: '',
                                tanggal: getLocalDatetime(),
                                keterangan: '',
                            });
                            setFormError('');
                        }
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>+ Transaksi</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Transaksi Kas</DialogTitle>
                            <DialogDescription>Isi data kas baru di bawah ini.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label className="mb-2" htmlFor="jenis">
                                    Jenis
                                </Label>
                                <Select value={data.jenis} onValueChange={(value) => setData('jenis', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Jenis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="masuk">Pemasukan</SelectItem>
                                        <SelectItem value="keluar">Pengeluaran</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2" htmlFor="nominal">
                                    Nominal
                                </Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm">Rp</span>
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        value={formatRupiah(data.nominal)}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            setData('nominal', raw);
                                        }}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                {formError && <p className="mt-1 text-sm text-red-500">{formError}</p>}
                            </div>

                            <div>
                                <Label className="mb-2" htmlFor="tanggal">
                                    Tanggal
                                </Label>
                                <Input type="datetime-local" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} required />
                            </div>

                            <div>
                                <Label className="mb-2" htmlFor="keterangan">
                                    Keterangan
                                </Label>
                                <Input value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
                            </div>

                            <Button type="submit" className="w-full">
                                Simpan
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Tabel Arus Kas */}
            <div className="mt-4 overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[160px]">Tanggal</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Nominal</TableHead>
                            <TableHead>Keterangan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {kas.length > 0 ? (
                            kas.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {(() => {
                                            const date = new Date(item.tanggal);
                                            const tanggal = date.toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            });
                                            const jam = date
                                                .toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })
                                                .replace('.', ':');
                                            return `${tanggal} ${jam}`;
                                        })()}
                                    </TableCell>

                                    <TableCell>{item.jenis ? 'Pemasukan' : 'Pengeluaran'}</TableCell>
                                    <TableCell>Rp {item.nominal.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>{item.keterangan ?? '-'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="py-8 text-center">
                                    Tidak ada data kas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
