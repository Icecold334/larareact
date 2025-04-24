import DispatchAlert from '@/components/dispatch-alert';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';

const breadcrumbs = [
    {
        title: 'Transaksi',
        href: '/kasir',
    },
];

('use client');

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function ComboboxDemo({ className, merks, setSelectedItem }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    useEffect(() => {
        window.addEventListener('addList', () => {
            setValue('');
        });
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn(className, 'w-full justify-between')}>
                    {value
                        ? (() => {
                              const merk = merks.find((m) => m.id === value);
                              return merk ? `${merk.uuid} - ${merk.nama} - ${merk.tipe} - ${merk.warna}` : 'Pilih Barang';
                          })()
                        : 'Pilih Barang'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Cari Barang..." className="h-10" />
                    <CommandList className="">
                        <CommandEmpty>Barang tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {merks.map((merk) => (
                                <CommandItem
                                    key={merk.id}
                                    value={merk.id}
                                    onSelect={() => {
                                        setValue(merk.id === value ? '' : merk.id);
                                        setSelectedItem(merk);
                                        setOpen(false);
                                    }}
                                >
                                    <span className="">
                                        {merk.uuid} - {merk.nama} - {merk.tipe} - {merk.warna}
                                    </span>
                                    <Check className={cn('ml-auto', value === merk.id ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function Cart({ setTotal, lists, setLists }) {
    useEffect(() => {
        const handleAddList = ({ detail }) => {
            const formattedData = {
                id: detail.id,
                uuid: detail.uuid,
                harga: detail.harga_jual,
                nama: detail.nama,
                tipe: detail.tipe,
                warna: detail.warna,
                jumlah: 1,
            };

            setLists((prev) => {
                const existingIndex = prev.findIndex((item) => item.id === detail.id);
                let newList;

                if (existingIndex !== -1) {
                    const updated = [...prev];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        jumlah: updated[existingIndex].jumlah + 1,
                    };
                    newList = updated;
                } else {
                    newList = [...prev, formattedData];
                }

                // Hitung total dan update
                const total = newList.reduce((acc, item) => acc + item.harga * item.jumlah, 0);
                setTotal(total);

                return newList;
            });
        };

        window.addEventListener('addList', handleAddList);
        return () => window.removeEventListener('addList', handleAddList);
    }, []);

    return (
        <Table className="">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[5%]">#</TableHead>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>Barang</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Warna</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Harga Satuan</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {lists.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-muted-foreground text-center text-lg font-semibold">
                            Tabel kosong
                        </TableCell>
                    </TableRow>
                ) : (
                    lists.map((item, i) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{i + 1}</TableCell>
                            <TableCell>{item.uuid}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                            <TableCell>{item.tipe}</TableCell>
                            <TableCell>{item.warna}</TableCell>
                            <TableCell>{item.jumlah}</TableCell>
                            <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga)}</TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga * item.jumlah)}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}

export default function Kasir() {
    const [lists, setLists] = React.useState([]);
    const [tableData, setTableData] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [total, setTotal] = React.useState(0);
    const fetchData = async () => {
        try {
            const response = await fetch('/barangs');
            const data = await response.json();

            // // Mapping hanya field yang dibutuhkan
            // const formattedData = data.map((barang, i) => ({
            //     id: barang.id,
            //     uuid: barang.uuid,
            //     number: i + 1,
            //     nama: barang.nama,
            //     tipe: barang.tipe,
            //     warna: barang.warna,
            // }));

            setTableData(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Transaksi">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <Card className="grid grid-cols-12 px-4 lg:col-span-2">
                    <ComboboxDemo className="col-span-12 lg:col-span-10" merks={tableData} setSelectedItem={setSelectedItem} />
                    <Button
                        className={`col-span-12 lg:col-span-2 ${selectedItem === null ? 'hidden' : ''}`}
                        onClick={() => {
                            const event = new CustomEvent('addList', {
                                detail: selectedItem,
                            });

                            window.dispatchEvent(event);
                            setSelectedItem(null);
                        }}
                    >
                        Tambah
                    </Button>
                </Card>
                <Card className="order-first col-span-1 flex items-center justify-center px-4 text-3xl font-semibold lg:order-none">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}
                </Card>
            </div>
            <Card className="max-h-[30rem] overflow-y-auto p-4">
                <Cart setTotal={setTotal} lists={lists} setLists={setLists} />
            </Card>
            <Button
                className={`col-span-12 text-2xl font-semibold lg:col-span-2 ${total > 0 ? '' : 'hidden'}`}
                onClick={() => {
                    router.post(
                        `/kasir`,
                        { lists },
                        {
                            onSuccess: () => {
                                DispatchAlert({ status: true, obj: 'Pembelian', text: 'disimpan' });
                                setSelectedItem(null);
                                setTotal(0);
                                setLists([]);
                            },
                            onError: (e) => {
                                DispatchAlert({ status: false, obj: 'Penjualan', text: 'disimpan' });
                            },
                        },
                    );
                }}
            >
                Bayar
            </Button>
        </AppLayout>
    );
}
