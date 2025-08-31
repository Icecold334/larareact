'use client';

import { Head, Link } from '@inertiajs/react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ChevronDown, Eye } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';

// === Columns ===
const columns = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'kode',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Kode
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('kode')}</div>,
    },
    {
        id: 'namaSupplier',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Nama Supplier
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const supplierName = row.original.supplier?.nama || '-';
            return <div className="capitalize">{supplierName}</div>;
        },
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
            return <div>{date.toLocaleString('id-ID')}</div>;
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

// === DataTable ===
export function DataTable({ tableData }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedAlamat, setSelectedAlamat] = useState('1'); // default alamat

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

    const handleExport = () => {
        const rows = table.getSelectedRowModel().rows;
        if (!rows.length) {
            alert('Pilih minimal 1 transaksi');
            return;
        }
        setSelectedRows(rows);
        setOpenDialog(true);
    };

    const confirmExport = () => {
        setOpenDialog(false);
        selectedRows.forEach((row) => {
            const kode = row.original.kode;
            const url = `/laporan/beli/${kode}/${selectedAlamat}/pdf`;
            window.open(url, '_blank');
        });
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Cari Kode"
                    value={String(table.getColumn('kode')?.getFilterValue() ?? '')}
                    onChange={(event) => table.getColumn('kode')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />

                <div className="flex items-center gap-2">
                    <Button onClick={handleExport}>Download PDF</Button>

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

            {/* Dialog pilih alamat */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pilih Alamat</DialogTitle>
                    </DialogHeader>

                    <RadioGroup value={selectedAlamat} onValueChange={setSelectedAlamat} className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="alamat1" />
                            <Label htmlFor="alamat1">Berkah Jaya Jl Yosodipuro 133 Solo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="alamat2" />
                            <Label htmlFor="alamat2">Toko Sinto Blok H5 Pasar Klewer Solo</Label>
                        </div>
                    </RadioGroup>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
                            Batal
                        </Button>
                        <Button onClick={confirmExport}>Export</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const breadcrumbs = [
    {
        title: 'Laporan Pembelian',
        href: '/laporan/beli',
    },
];

export default function Page() {
    const [tableData, setTableData] = useState([]);

    async function fetchData() {
        const response = await fetch('/laporan/fetch/beli');
        const data = await response.json();
        const parsedData = Object.values(data);
        setTableData(parsedData);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Laporan Pembelian">
            <Head title="Laporan Pembelian" />
            <DataTable tableData={tableData} />
        </AppLayout>
    );
}
