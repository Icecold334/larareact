import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Dummy data summary
const dataSummary = {
    penjualanHariIni: 1500000,
    penjualanBulanIni: 32000000,
    pembelianHariIni: 500000,
    pembelianBulanIni: 12000000,
    kasMasuk: 35000000,
    kasKeluar: 15000000,
    saldoKas: 20000000,
};

// Dummy data for charts
const transaksiChart = [
    { tanggal: '01 Jun', penjualan: 5000000, pembelian: 2000000 },
    { tanggal: '02 Jun', penjualan: 4200000, pembelian: 3500000 },
    { tanggal: '03 Jun', penjualan: 5800000, pembelian: 2500000 },
    { tanggal: '04 Jun', penjualan: 7000000, pembelian: 4000000 },
    { tanggal: '05 Jun', penjualan: 3000000, pembelian: 1500000 },
];

const kasChart = [
    { tanggal: '01 Jun', masuk: 6000000, keluar: 500000 },
    { tanggal: '02 Jun', masuk: 4500000, keluar: 1500000 },
    { tanggal: '03 Jun', masuk: 50000000, keluar: 2200000 },
    { tanggal: '04 Jun', masuk: 7000000, keluar: 3000000 },
    { tanggal: '05 Jun', masuk: 6500000, keluar: 1800000 },
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Dashboard">
            <Head title="Dashboard" />

            {/* Summary Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="bg-muted col-span-1 rounded-md border p-4 shadow-sm md:col-span-2 xl:col-span-3">
                    <p className="text-muted-foreground text-sm">Saldo Kas Saat Ini</p>
                    <p className="text-primary text-2xl font-bold">{formatRupiah(dataSummary.saldoKas)}</p>
                </div>
                <div className="rounded-md border p-4 shadow-sm">
                    <p className="text-muted-foreground text-sm">Penjualan Hari Ini</p>
                    <p className="text-lg font-semibold">{formatRupiah(dataSummary.penjualanHariIni)}</p>
                </div>

                <div className="rounded-md border p-4 shadow-sm">
                    <p className="text-muted-foreground text-sm">Penjualan Bulan Ini</p>
                    <p className="text-lg font-semibold">{formatRupiah(dataSummary.penjualanBulanIni)}</p>
                </div>

                <div className="rounded-md border p-4 shadow-sm">
                    <p className="text-muted-foreground text-sm">Pembelian Hari Ini</p>
                    <p className="text-lg font-semibold">{formatRupiah(dataSummary.pembelianHariIni)}</p>
                </div>

                <div className="rounded-md border p-4 shadow-sm">
                    <p className="text-muted-foreground text-sm">Pembelian Bulan Ini</p>
                    <p className="text-lg font-semibold">{formatRupiah(dataSummary.pembelianBulanIni)}</p>
                </div>

                <div className="rounded-md border p-4 shadow-sm">
                    <p className="text-muted-foreground text-sm">Total Pemasukan (Kas Masuk)</p>
                    <p className="text-lg font-semibold text-green-600">{formatRupiah(dataSummary.kasMasuk)}</p>
                </div>

                <div className="rounded-md border p-4 shadow-sm">
                    <p className="text-muted-foreground text-sm">Total Pengeluaran (Kas Keluar)</p>
                    <p className="text-lg font-semibold text-red-600">{formatRupiah(dataSummary.kasKeluar)}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Grafik Penjualan dan Pembelian */}
                <div className="mb-8">
                    <h2 className="mb-2 text-lg font-semibold">Grafik Penjualan vs Pembelian</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={transaksiChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="tanggal" />
                                <YAxis tickFormatter={(v) => v / 1000000 + 'jt'} />
                                <Tooltip formatter={(value) => formatRupiah(value)} />
                                <Legend />
                                <Line type="monotone" dataKey="penjualan" stroke="#16a34a" name="Penjualan" />
                                <Line type="monotone" dataKey="pembelian" stroke="#ef4444" name="Pembelian" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Grafik Arus Kas */}
                <div className="mb-8">
                    <h2 className="mb-2 text-lg font-semibold">Grafik Arus Kas Masuk & Keluar</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={kasChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="tanggal" />
                                <YAxis tickFormatter={(v) => v / 1000000 + 'jt'} />
                                <Tooltip formatter={(value) => formatRupiah(value)} />
                                <Legend />
                                <Line type="monotone" dataKey="masuk" stroke="#3b82f6" name="Kas Masuk" />
                                <Line type="monotone" dataKey="keluar" stroke="#f59e0b" name="Kas Keluar" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
