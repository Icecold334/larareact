'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

export default function ShowTransaksi() {
    const { props } = usePage();
    const transaksiList = props.transaksi;

    if (!transaksiList.length) {
        return <div className="p-4 text-center">Transaksi tidak ditemukan.</div>;
    }

    const transaksi = transaksiList[0];
    const isPembelian = transaksi.jenis === 1;

    // Cek apakah penjualan ini ada pajak
    const isPakaiPajak = !isPembelian && transaksiList.some((trx) => parseFloat(trx.pajak_persen) > 0);

    const subtotal = transaksiList.reduce((acc, trx) => {
        const hargaBeli = trx.supplier?.barangs?.find((b) => b.id === trx.barang_id)?.pivot?.harga_beli;
        const harga = isPembelian ? (hargaBeli ?? trx.barang.harga_jual) : trx.barang.harga_jual;
        return acc + harga * trx.jumlah;
    }, 0);

    const totalJumlah = transaksiList.reduce((acc, trx) => acc + trx.jumlah, 0);

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: isPembelian ? 'Laporan Pembelian' : 'Laporan Penjualan',
                    href: isPembelian ? '/laporan/beli' : '/laporan/jual',
                },
                {
                    title: transaksi.kode,
                    href: isPembelian ? `/laporan/beli/${transaksi.kode}` : `/laporan/jual/${transaksi.kode}`,
                },
            ]}
            title={`Detail ${isPembelian ? 'Pembelian' : 'Penjualan'}`}
        >
            {/* Tombol Kembali */}
            <div className="mb-4 flex justify-end">
                <Button variant="outline" onClick={() => history.back()}>
                    Kembali
                </Button>
            </div>

            {/* Info Transaksi */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-6">
                    <h2 className="text-2xl font-bold">Informasi Transaksi</h2>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-muted-foreground font-medium">Kode</TableCell>
                                <TableCell>{transaksi.kode}</TableCell>
                            </TableRow>
                            {isPembelian && (
                                <TableRow>
                                    <TableCell className="text-muted-foreground font-medium">Supplier</TableCell>
                                    <TableCell>{transaksi.supplier?.nama || '-'}</TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell className="text-muted-foreground font-medium">Tanggal</TableCell>
                                <TableCell>{new Date(transaksi.created_at).toLocaleDateString('id-ID')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className="hidden md:block" />
            </div>

            {/* List Barang */}
            <div className="mt-6 rounded-lg border p-6">
                <h2 className="-mb-2 text-2xl font-bold">{isPembelian ? 'Daftar Barang Dibeli' : 'Daftar Barang Terjual'}</h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Barang</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Warna</TableHead>
                                {!isPembelian && <TableHead>Supplier</TableHead>}
                                <TableHead>Harga {isPembelian ? 'Beli' : 'Jual'}</TableHead>
                                {isPembelian && <TableHead>Harga Jual</TableHead>}
                                <TableHead>Jumlah</TableHead>
                                {isPakaiPajak && <TableHead>Pajak</TableHead>}
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transaksiList.map((trx) => {
                                const hargaBeli =
                                    trx.supplier?.barangs?.find((b) => b.id === trx.barang_id)?.pivot?.harga_beli ?? trx.barang.harga_jual;
                                const harga = isPembelian ? hargaBeli : trx.barang.harga_jual;
                                return (
                                    <TableRow key={trx.id}>
                                        <TableCell>{trx.barang.nama}</TableCell>
                                        <TableCell>{trx.barang.tipe}</TableCell>
                                        <TableCell>{trx.barang.warna}</TableCell>
                                        {!isPembelian && <TableCell>{trx.supplier?.nama ?? '-'}</TableCell>}
                                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(harga)}</TableCell>
                                        {isPembelian && (
                                            <TableCell>
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trx.barang.harga_jual)}
                                            </TableCell>
                                        )}
                                        <TableCell>{trx.jumlah}</TableCell>
                                        {isPakaiPajak && <TableCell>{trx.pajak_persen ? `${trx.pajak_persen}%` : '-'}</TableCell>}
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(harga * trx.jumlah)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                            {/* Total Jumlah */}
                            <TableRow>
                                <TableCell colSpan={isPembelian ? 5 : isPakaiPajak ? 6 : 5} />
                                <TableCell className="text-right font-bold">Total Jumlah</TableCell>
                                <TableCell className="text-right font-bold">{totalJumlah} pcs</TableCell>
                            </TableRow>

                            {/* Total Harga */}
                            <TableRow>
                                <TableCell colSpan={isPembelian ? 5 : isPakaiPajak ? 6 : 5} />
                                <TableCell className="text-right font-bold">Total Harga</TableCell>
                                <TableCell className="text-right font-bold">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subtotal)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
