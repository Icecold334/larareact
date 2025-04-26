'use client';

import AppLayout from '@/layouts/app-layout';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';

const columns = ({ cols }) => {
    const [tableCols, setTableCols] = useState([]);

    useEffect(() => {
        setTableCols(
            cols.cols
                .map((e) => ({
                    accessorKey: e.col,
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            className="capitalize"
                            onClick={() => (e.sortable ? column.toggleSorting(column.getIsSorted() === 'asc') : 0)}
                        >
                            {e.col}
                            {e.sortable && <ArrowUpDown className="ml-2 h-4 w-4" />}
                        </Button>
                    ),
                    cell: ({ row }) => (
                        <div>
                            {e.rupiah
                                ? Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.getValue(e.col))
                                : row.getValue(e.col)}
                        </div>
                    ),
                }))
                .concat([
                    {
                        id: 'actions',
                        enableHiding: false,
                        cell: ({ row }) => {
                            const item = row.original;
                            return (
                                <Button variant="ghost" size="icon" onClick={() => router.visit(`/${cols.href}/${item.id}`)}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                            );
                        },
                    },
                ]),
        );
    }, []);

    return tableCols;
};

export function DataTable({ data, cols }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns: columns({ cols }),
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
        <>
            <div className="w-full">
                <div className="flex items-center justify-between py-4">
                    <Input
                        placeholder={`Cari ${cols.search} ${cols.table.toLowerCase()}`}
                        value={table.getColumn(cols.search)?.getFilterValue() ?? ''}
                        onChange={(e) => table.getColumn(cols.search)?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Tampilkan <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                        Tidak Ada Data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="text-muted-foreground flex-1 text-sm">Menampilkan {table.getFilteredRowModel().rows.length} baris data.</div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <ChevronLeft />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function Index() {
    const breadcrumbs = [
        {
            title: 'Daftar Barang',
            href: '/barang',
        },
    ];
    const [tableData, setTableData] = useState([]);
    const [cols] = useState({
        table: 'Barang',
        href: 'barang',
        copy: 'nama',
        search: 'nama',
        cols: [
            { col: 'nama', sortable: true, type: 'text', rupiah: false, min: 3 },
            { col: 'tipe', sortable: true, type: 'text', rupiah: false, min: 3 },
            { col: 'warna', sortable: true, type: 'text', rupiah: false, min: 3 },
            { col: 'harga', sortable: true, type: 'text', rupiah: true, min: 3 },
            { col: 'stok', sortable: true, type: 'text', rupiah: false, min: 3 },
        ],
    });

    const fetchData = async () => {
        const response = await fetch('/barangs');
        const data = await response.json();
        const newData = data.map((e) => ({
            ...e,
            harga: e.harga_jual,
        }));
        setTableData(newData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        window.addEventListener('alert', ({ detail }) => {
            if (detail.status) {
                return fetchData();
            }
        });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Daftar Barang">
            <DataTable data={tableData} cols={cols} />
        </AppLayout>
    );
}
