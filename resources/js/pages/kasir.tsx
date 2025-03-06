import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kasir',
        href: '/kasir',
    },
];

export default function Kasir() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kasir" />
        </AppLayout>
    );
}
