('use client');
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Pen, X } from 'lucide-react';
import * as React from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Create from './create';
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/10',
            className,
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg',
                className,
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';
const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Title ref={ref} className={cn('text-lg leading-none font-semibold tracking-tight', className)} {...props} />
    ),
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />);
DialogDescription.displayName = DialogPrimitive.Description.displayName;
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };
interface Supplier {
    id: string;
    number: number;
    nama: string;
    alamat: string;
    telepon: string;
}
const columns = (handleOpenDialog: (supplier: Supplier | null) => void): ColumnDef<Supplier>[] => [
    // {
    //     id: 'select',
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: 'number',
        size: 3,
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    #
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="text-center capitalize">{row.getValue('number')}</div>,
        enableHiding: false,
    },
    {
        accessorKey: 'nama',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nama
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue('nama')}</div>,
    },
    {
        accessorKey: 'telepon',
        header: () => {
            return 'Telepon';
        },
        cell: ({ row }) => <div className="text-right font-medium">{row.getValue('telepon')}</div>,
    },
    {
        accessorKey: 'alamat',
        header: () => {
            return 'Alamat';
        },
        cell: ({ row }) => <div className="">{row.getValue('alamat')}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const supplier = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(supplier.telepon)}>Salin Nomor Telepon</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenDialog(supplier)}>
                            <Pen /> Edit Supplier
                        </DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Supplier',
        href: '/supplier',
    },
];
function DataTable({
    columns,
    data,
    selectedSupplier,
    dialogOpen,
    setDialogOpen,
    handleOpenDialog,
}: {
    handleOpenDialog: (supplier: Supplier) => void;
    columns: ColumnDef<Supplier>[];
    data: Supplier[];
    selectedSupplier: Supplier | null;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
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
                    placeholder="Cari Supplier"
                    value={(table.getColumn('nama')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('nama')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <div className="flex gap-6">
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Tampilkan <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <Button className={buttonVariants()} onClick={() => handleOpenDialog(null)}>
                            <Plus /> Tambah Supplier
                        </Button>
                        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{selectedSupplier ? `Edit Supplier: ${selectedSupplier.nama}` : 'Tambah Supplier'}</DialogTitle>
                                    <DialogDescription>
                                        <Create supplier={selectedSupplier} />
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        {/* <Link href="supplier/create" prefetch></Link> */}
                    </div>
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
                                    Supplier tidak ditemukan
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
        </div>
    );
}
export default function Index() {
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const handleOpenDialog = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setDialogOpen(true);
    };
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tableData, setTableData] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const fetchSuppliers = async () => {
        try {
            const response = await fetch('/suppliers');
            const data = await response.json();

            // Mapping hanya field yang dibutuhkan
            const formattedData = data.map((supplier: Supplier, i: number) => ({
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
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchSuppliers();
    }, []);
    useEffect(() => {
        window.addEventListener('alert', (event: Event) => {
            const data = (event as CustomEvent).detail;
            if (data.status) {
                setDialogOpen(false);
                fetchSuppliers();
            }
        });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supplier" />
            {isLoading ? (
                <>
                    <Skeleton className="mt-10 h-10 w-full" />
                    <Skeleton className="h-72 w-full" />
                </>
            ) : (
                <DataTable
                    columns={columns(handleOpenDialog)}
                    handleOpenDialog={handleOpenDialog}
                    data={tableData}
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    selectedSupplier={selectedSupplier}
                />
            )}
        </AppLayout>
    );
}
