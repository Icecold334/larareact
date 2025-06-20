'use client';

import { Head, Link } from '@inertiajs/react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { ArrowUpDown, ChevronDown, Eye } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Calendar } from '@/components/ui/calendar';
import { getMonth, getYear } from 'date-fns';

function DynamicDatePicker({ type, selectedDate, onSelect }) {
    if (type === 'harian') {
        return <Calendar mode="single" selected={selectedDate} onSelect={onSelect} initialFocus />;
    }

    if (type === 'bulanan') {
        const months = Array.from({ length: 12 }, (_, i) => i); // 0–11
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

        return (
            <div className="flex flex-col gap-2 p-4">
                <Select
                    value={selectedDate ? String(getMonth(selectedDate)) : ''}
                    onValueChange={(month) => {
                        const newDate = selectedDate
                            ? new Date(getYear(selectedDate), Number(month), 1)
                            : new Date(new Date().getFullYear(), Number(month), 1);
                        onSelect(newDate);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((month) => (
                            <SelectItem key={month} value={String(month)}>
                                {format(new Date(0, month), 'MMMM')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedDate ? String(getYear(selectedDate)) : ''}
                    onValueChange={(year) => {
                        const newDate = selectedDate ? new Date(Number(year), getMonth(selectedDate), 1) : new Date(Number(year), 0, 1);
                        onSelect(newDate);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    if (type === 'tahunan') {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

        return (
            <div className="p-4">
                <Select
                    value={selectedDate ? String(getYear(selectedDate)) : ''}
                    onValueChange={(year) => {
                        const newDate = new Date(Number(year), 0, 1);
                        onSelect(newDate);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    return null;
}

const columns = [
    {
        accessorKey: 'kode',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Kode Transaksi
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('kode')}</div>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Tanggal
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return <div>{date.toLocaleDateString('id-ID')}</div>;
        },
    },
    {
        accessorKey: 'menggunakan_pajak',
        header: 'Menggunakan Pajak',
        cell: ({ row }) => <div>{row.original.menggunakan_pajak ? 'Ya' : 'Tidak'}</div>,
    },
    {
        accessorKey: 'total_kotor',
        header: 'Total Kotor',
        cell: ({ row }) => {
            const total = Number(row.original.total_kotor ?? 0);
            return (
                <div>
                    {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                    }).format(total)}
                </div>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const kode = row.original.kode;
            return (
                <div className="text-center">
                    <Link href={`/laporan/detail/${kode}`} prefetch>
                        <Eye className="h-4 w-4" />
                    </Link>
                </div>
            );
        },
    },
];

export function DataTable({ rawData }) {
    const [filterPajak, setFilterPajak] = useState('semua');
    const [filterTanggalType, setFilterTanggalType] = useState('harian');
    const [filterTanggal, setFilterTanggal] = useState(null);

    const filteredData = useMemo(() => {
        return rawData.filter((item) => {
            const itemDate = new Date(item.created_at);
            const selectedDate = filterTanggal;

            let tanggalMatch = true;
            if (selectedDate) {
                if (filterTanggalType === 'harian') {
                    tanggalMatch = format(itemDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                } else if (filterTanggalType === 'bulanan') {
                    tanggalMatch = format(itemDate, 'yyyy-MM') === format(selectedDate, 'yyyy-MM');
                } else if (filterTanggalType === 'tahunan') {
                    tanggalMatch = format(itemDate, 'yyyy') === format(selectedDate, 'yyyy');
                }
            }

            const pajakMatch = filterPajak === 'semua' ? true : filterPajak === 'ya' ? item.menggunakan_pajak : !item.menggunakan_pajak;

            return tanggalMatch && pajakMatch;
        });
    }, [rawData, filterTanggal, filterTanggalType, filterPajak]);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState([]);

    const table = useReactTable({
        data: filteredData,
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
            <div className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="flex flex-wrap gap-4">
                    {/* Tanggal */}
                    <div className="flex items-center gap-2">
                        <Select value={filterTanggalType} onValueChange={setFilterTanggalType}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="harian">Harian</SelectItem>
                                <SelectItem value="bulanan">Bulanan</SelectItem>
                                <SelectItem value="tahunan">Tahunan</SelectItem>
                            </SelectContent>
                        </Select>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                                    {filterTanggal
                                        ? filterTanggalType === 'harian'
                                            ? format(filterTanggal, 'dd/MM/yyyy')
                                            : filterTanggalType === 'bulanan'
                                              ? format(filterTanggal, 'MMMM yyyy')
                                              : format(filterTanggal, 'yyyy')
                                        : 'Pilih Tanggal'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <DynamicDatePicker type={filterTanggalType} selectedDate={filterTanggal} onSelect={setFilterTanggal} />
                            </PopoverContent>
                        </Popover>

                        {filterTanggal && (
                            <Button variant="ghost" size="sm" onClick={() => setFilterTanggal(null)} className="text-xs text-red-500">
                                Reset
                            </Button>
                        )}
                    </div>

                    {/* Pajak */}
                    <Select value={filterPajak} onValueChange={setFilterPajak}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Filter Pajak" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semua">Semua Pajak</SelectItem>
                            <SelectItem value="ya">Ya</SelectItem>
                            <SelectItem value="tidak">Tidak</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Kode */}
                    <Input
                        placeholder="Cari Kode Transaksi"
                        value={String(table.getColumn('kode')?.getFilterValue() ?? '')}
                        onChange={(event) => table.getColumn('kode')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Tampilkan <ChevronDown />
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
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">Menampilkan {table.getFilteredRowModel().rows.length} data.</div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

const breadcrumbs = [
    {
        title: 'Laporan Penjualan',
        href: '/laporan/jual',
    },
];

export default function Page() {
    const [tableData, setTableData] = useState([]);

    async function fetchData() {
        const response = await fetch('/laporan/fetch/jual');
        const data = await response.json();
        const arrayData = Array.isArray(data) ? data : Object.values(data);
        setTableData(arrayData);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Laporan Penjualan">
            <Head title="Laporan Penjualan" />
            <DataTable rawData={tableData} />
        </AppLayout>
    );
}
