'use client';
import AppLayout from '@/layouts/app-layout';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
('use client');

import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Create from './create';

// const columns = ({ setDialogOpen, setSupplier, cols }) => [
//     {
//         accessorKey: 'nama',
//         header: 'Nama',
//         cell: ({ row }) => <div className="capitalize">{row.getValue('nama')}</div>,
//     },
//     {
//         accessorKey: 'telepon',
//         header: ({ column }) => (
//             <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                 Telepon
//                 <ArrowUpDown />
//             </Button>
//         ),
//         cell: ({ row }) => <div className="">{row.getValue('telepon')}</div>,
//     },
//     {
//         accessorKey: 'alamat',
//         header: ({ column }) => (
//             <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                 Alamat
//                 <ArrowUpDown />
//             </Button>
//         ),
//         cell: ({ row }) => <div className="">{row.getValue('alamat')}</div>,
//     },
//     {
//         id: 'actions',
//         enableHiding: false,
//         cell: ({ row }) => {
//             const payment = row.original;

//             return (
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                             <span className="sr-only">Open menu</span>
//                             <MoreHorizontal />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                             onClick={() => {
//                                 navigator.clipboard.writeText(payment.telepon);
//                                 DispatchAlert({ status: true, obj: 'Nomor Telepon', text: 'disalin' });
//                             }}
//                         >
//                             Salin Nomor Telepon
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                             onClick={() => {
//                                 setDialogOpen(true);
//                                 setSupplier(payment);
//                             }}
//                         >
//                             <Pen /> Edit Supplier
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                             variant="destructive"
//                             onClick={() => {
//                                 Swal.fire({
//                                     title: 'Hapus Supplier?',
//                                     text: 'Apakah Anda yakin ingin menghapus supplier ini? Tindakan ini tidak dapat dibatalkan!',
//                                     icon: 'warning',
//                                     showCancelButton: true,
//                                     confirmButtonText: 'Ya, hapus!',
//                                     cancelButtonText: 'Batal',
//                                 }).then((result) => {
//                                     if (result.isConfirmed) {
//                                         router.delete(`/supplier/${payment.id}`, {
//                                             onSuccess: () => {
//                                                 DispatchAlert({ status: true, obj: 'Supplier', text: 'dihapus' });
//                                             },
//                                             onError: () => {
//                                                 DispatchAlert({ status: false, obj: 'Supplier', text: 'dihapus' });
//                                             },
//                                         });
//                                     }
//                                 });
//                             }}
//                         >
//                             <Trash /> Hapus Supplier
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             );
//         },
//     },
// ];
const columns = ({ setDialogOpen, setSupplier, cols }) => {
    const [tableCols, setTableCols] = useState([]);

    useEffect((e) => {
        setTableCols(
            cols.map((e) => ({
                accessorKey: e.col,
                header: e.col,
                cell: ({ row }) => <div className="capitalize">{row.getValue('nama')}</div>,
            })),
        );
    }, []);

    return tableCols;
};

export function Datatable({ data, dialogOpen, setDialogOpen, cols }) {
    const [sorting, setSorting] = React.useState([]);
    const [supplier, setSupplier] = React.useState(null);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns: columns({ setDialogOpen, setSupplier, cols }),
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
                    placeholder="Cari nama supplier"
                    value={table.getColumn('nama')?.getFilterValue() ?? ''}
                    onChange={(event) => table.getColumn('nama')?.setFilterValue(event.target.value)}
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
                            setSupplier(null);
                        }}
                    >
                        <Plus />
                        Tambah Supplier
                    </Button>
                    <Modal open={dialogOpen} setOpen={setDialogOpen} title={supplier?.nama ?? 'Tambah Supplier'}>
                        <Create supplier={supplier} />
                    </Modal>
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
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Tidak Ada Data
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
                        <ChevronLeft />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}

const breadcrumbs = [
    {
        title: 'Daftar Supplier',
        href: '/supplier',
    },
];

export default function Index() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cols] = useState([
        {
            col: 'nama',
            sortable: true,
        },
        {
            col: 'telepon',
            sortable: true,
        },
        {
            col: 'alamat',
            sortable: false,
        },
    ]);
    const [tableData, setTableData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await fetch('/suppliers');
            const data = await response.json();

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
        async function fetchData() {
            const response = await fetch('/suppliers');
            const data = await response.json();
            setTableData(data);
        }
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
            <Datatable data={tableData} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} cols={cols} />
        </AppLayout>
    );
}
