'use client';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';
('use client');

import DataTable from '@/components/data-table';

export default function Index() {
    const breadcrumbs = [
        {
            title: 'Daftar Barang',
            href: '/barang',
        },
    ];
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [cols] = useState({
        table: 'Barang',
        href: 'barang',
        copy: 'nama',
        search: 'nama',
        cols: [
            {
                col: 'supplier',
                sortable: true,
                type: 'text',
                rupiah: false,
                min: 3,
            },
            {
                col: 'nama',
                sortable: true,
                type: 'text',
                rupiah: false,
                min: 3,
            },
            {
                col: 'harga',
                sortable: true,
                type: 'text',
                rupiah: true,
                min: 3,
            },
        ],
    });
    async function fetchData() {
        const response = await fetch('/barangs');
        const data = await response.json();

        const newData = data.map((e) => ({
            ...e,
            supplier: e.supplier.nama,
            harga: e.harga ? String(e.harga) : '', // Jika undefined/null, kosongkan string
        }));
        setTableData(newData);
    }
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        window.addEventListener('alert', ({ detail }) => {
            if (detail.status) {
                setDialogOpen(false);
                return fetchData();
            }
        });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Daftar Barang">
            <DataTable data={tableData} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} cols={cols} />
        </AppLayout>
    );
}
