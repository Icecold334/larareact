'use client';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Copy, MoreHorizontal, Pen, Plus, Trash } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
('use client');

import DispatchAlert from '@/components/dispatch-alert';

import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Form from './form';

const columns = ({ setDialogOpen, setObj, cols }) => {
    const [tableCols, setTableCols] = useState([]);

    useEffect((e) => {
        setTableCols(
            cols.cols
                .map((e) => ({
                    accessorKey: e.col,
                    header: ({ column }) => {
                        return (
                            <Button
                                variant="ghost"
                                className="capitalize"
                                onClick={() => {
                                    return e.sortable ? column.toggleSorting(column.getIsSorted() === 'asc') : 0;
                                }}
                            >
                                {e.col}
                                {e.sortable && <ArrowUpDown />}
                            </Button>
                        );
                    },
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
                                        <DropdownMenuItem
                                            onClick={() => {
                                                navigator.clipboard.writeText(payment[cols.copy]);
                                                DispatchAlert({
                                                    status: true,
                                                    obj: cols.copy.charAt(0).toUpperCase() + cols.copy.slice(1).toLowerCase(),
                                                    text: 'disalin',
                                                });
                                            }}
                                        >
                                            <Copy /> Salin {cols.copy.charAt(0).toUpperCase() + cols.copy.slice(1).toLowerCase()}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setDialogOpen(true);
                                                setObj(payment);
                                            }}
                                        >
                                            <Pen /> Edit {cols.table}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => {
                                                Swal.fire({
                                                    title: `Hapus ${cols.table} ?`,
                                                    text: `Apakah Anda yakin ingin menghapus ${cols.table.toLowerCase()} ini? Tindakan ini tidak dapat dibatalkan!`,
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Ya, hapus!',
                                                    cancelButtonText: 'Batal',
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        router.delete(`/${cols.href}/${payment.id}`, {
                                                            onSuccess: () => {
                                                                DispatchAlert({ status: true, obj: cols.table, text: 'dihapus' });
                                                            },
                                                            onError: () => {
                                                                DispatchAlert({ status: false, obj: cols.table, text: 'dihapus' });
                                                            },
                                                        });
                                                    }
                                                });
                                            }}
                                        >
                                            <Trash /> Hapus {cols.table}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            );
                        },
                    },
                ]),
        );
    }, []);

    return tableCols;
};

export default function ({ data, dialogOpen, setDialogOpen, cols }) {
    const [sorting, setSorting] = React.useState([]);
    const [obj, setObj] = React.useState(null);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns: columns({ setDialogOpen, setObj, cols }),
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
                        placeholder={'Cari ' + cols.search + ' ' + cols.table.toLowerCase()}
                        value={table.getColumn(cols.search)?.getFilterValue() ?? ''}
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
                                setObj(null);
                            }}
                        >
                            <Plus />
                            Tambah {cols.table}
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
                        {/* {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected. */}
                        Menampilkan {table.getFilteredRowModel().rows.length} baris data.
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
            <Modal open={dialogOpen} setOpen={setDialogOpen} title={obj?.nama ?? 'Tambah ' + cols.table}>
                <Form obj={obj} cols={cols} />
            </Modal>
        </>
    );
}
