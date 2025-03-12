import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
    {
        title: 'Transaksi',
        href: '/kasir',
    },
];

export default function Kasir() {
    return <AppLayout breadcrumbs={breadcrumbs} title="Transaksi"></AppLayout>;
}
