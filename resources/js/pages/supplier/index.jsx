'use client';
import DataTable from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';
('use client');

export default function Index() {
    const breadcrumbs = [
        {
            title: 'Daftar Supplier',
            href: '/supplier',
        },
    ];
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cols] = useState({
        table: 'Supplier',
        href: 'supplier',
        copy: 'telepon',
        search: 'nama',
        cols: [
            {
                col: 'nama',
                sortable: true,
                type: 'text',
                rupiah: false,
                min: 3,
            },
            {
                col: 'telepon',
                sortable: true,
                type: 'text',
                rupiah: false,
                min: 11,
            },
            {
                col: 'alamat',
                sortable: false,
                type: 'textarea',
                rupiah: false,
                min: 5,
            },
        ],
    });
    const [tableData, setTableData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await fetch('/suppliers/false');
            const data = await response.json();
            console.log(data);

            // Mapping hanya field yang dibutuhkan
            const formattedData = data.map((supplier, i) => ({
                id: supplier.id,
                number: i + 1,
                nama: supplier.nama,
                alamat: supplier.alamat,
                telepon: supplier.telepon,
            }));

            setTableData(formattedData);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            // setIsLoading(false);
        }
    };
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
        <AppLayout breadcrumbs={breadcrumbs} title="Daftar Supplier">
            <DataTable data={tableData} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} cols={cols} />
        </AppLayout>
    );
}
