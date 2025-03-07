import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Supplier',
        href: '/supplier',
    },
    {
        title: 'Tambah Supplier',
        href: '/supplier/create',
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Supplier" />
        </AppLayout>
    );
}
