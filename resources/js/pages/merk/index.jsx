'use client';

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import Form from '@/components/form';
import Modal from '@/components/modal';

import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';

export const columns = [
    {
        id: 'namaBarang', // Tambahkan id unik
        accessorFn: (row) => row.barang?.nama, // Ambil dari relasi barang
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nama Barang
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="capitalize">{row.original.barang?.nama || '-'}</div>;
        },
        sortingFn: 'alphanumeric', // Sorting teks
    },
    {
        accessorKey: 'tipe',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Tipe
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="">{row.getValue('tipe')}</div>,
    },
    {
        accessorKey: 'warna',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Warna
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="">{row.getValue('warna')}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function DataTable({ tableData }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [barangData, setBarangData] = useState([]);
    async function fetchData() {
        const response = await fetch('/barangs');
        const data = await response.json();

        const newData = data.map((e) => ({
            ...e,
            supplier: e.supplier.nama,
            harga: e.harga ? String(e.harga) : '', // Jika undefined/null, kosongkan string
        }));
        setBarangData(newData);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const [obj, setObj] = React.useState(null);

    const [cols, setCols] = React.useState({
        table: 'Supplier',
        href: 'supplier',
        copy: 'telepon',
        search: 'nama',
        cols: [
            {
                col: 'namaBarang',
                sortable: true,
                type: 'select',
                options: barangData,
                rupiah: false,
                min: 3,
            },
            {
                col: 'tipe',
                sortable: true,
                type: 'text',
                rupiah: false,
                min: 3,
            },
            {
                col: 'warna',
                sortable: true,
                type: 'text',
                rupiah: false,
                min: 3,
            },
        ],
    });
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const table = useReactTable({
        data: tableData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Cari Tipe"
                    value={table.getColumn('tipe')?.getFilterValue() ?? ''}
                    onChange={(event) => table.getColumn('tipe')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Tampilkan <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={() => {
                            setDialogOpen(true);
                        }}
                    >
                        <Plus />
                        Tambah Merk
                    </Button>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
            <Modal open={dialogOpen} setOpen={setDialogOpen} title={'Tambah Merk'}>
                <Form obj={obj} cols={cols} />
            </Modal>
        </div>
    );
}
export default function () {
    const breadcrumbs = [
        {
            title: 'Daftar Barang',
            href: '/barang',
        },
    ];
    const [tableData, setTableData] = useState([]);

    async function fetchData() {
        const response = await fetch('/merks');
        const data = await response.json();
        const newData = data.map((e) => ({
            ...e,
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
        <AppLayout breadcrumbs={breadcrumbs} title="Daftar Merk">
            <DataTable tableData={tableData} />
        </AppLayout>
    );
}
