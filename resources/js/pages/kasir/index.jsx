'use client';
import { AlertCircle, Check, ChevronsUpDown, X } from 'lucide-react';

import DispatchAlert from '@/components/dispatch-alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs = [{ title: 'Transaksi', href: '/kasir' }];

// ================= COMBOBOX ===================
export function ComboboxDemo({ className, merks, setSelectedItem }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    useEffect(() => {
        window.addEventListener('addList', () => setValue(''));
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
                    <CommandList>
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
                                    <span>
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

// ================= CART ===================
export function Cart({ setTotal, lists, setLists, setIsStokValid }) {
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
                stok: detail.stok,
            };

            setLists((prev) => {
                const existingIndex = prev.findIndex((item) => item.id === detail.id);
                let newList;
                if (existingIndex !== -1) {
                    const updated = [...prev];
                    updated[existingIndex].jumlah += 1;
                    newList = updated;
                } else {
                    newList = [...prev, formattedData];
                }
                const total = newList.reduce((acc, item) => acc + item.harga * item.jumlah, 0);
                setTotal(total);
                return newList;
            });
        };

        window.addEventListener('addList', handleAddList);
        return () => window.removeEventListener('addList', handleAddList);
    }, [setLists, setTotal]);

    const handleJumlahChange = (index, value) => {
        const val = parseInt(value, 10);
        if (isNaN(val) || val < 1) return;

        setLists((prev) => {
            const updated = [...prev];
            updated[index].jumlah = val;
            const total = updated.reduce((acc, item) => acc + item.harga * item.jumlah, 0);
            setTotal(total);

            const stokValid = updated.every((item) => item.jumlah <= item.stok);
            setIsStokValid(stokValid);

            return updated;
        });
    };

    const handleRemoveItem = (index) => {
        setLists((prev) => {
            const updated = [...prev];
            updated.splice(index, 1);
            const total = updated.reduce((acc, item) => acc + item.harga * item.jumlah, 0);
            setTotal(total);

            const stokValid = updated.every((item) => item.jumlah <= item.stok);
            setIsStokValid(stokValid);

            return updated;
        });
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[5%]">#</TableHead>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>Barang</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Warna</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Harga Satuan</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead />
                </TableRow>
            </TableHeader>
            <TableBody>
                {lists.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-muted-foreground text-center text-lg font-semibold">
                            Tabel kosong
                        </TableCell>
                    </TableRow>
                ) : (
                    lists.map((item, i) => (
                        <TableRow key={item.id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{item.uuid}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                            <TableCell>{item.tipe}</TableCell>
                            <TableCell>{item.warna}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        max={item.stok}
                                        value={item.jumlah}
                                        onChange={(e) => handleJumlahChange(i, e.target.value)}
                                        className="w-20"
                                    />
                                    <div className="text-muted-foreground text-xs">Sisa: {item.stok}</div>
                                </div>
                            </TableCell>
                            <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga)}</TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga * item.jumlah)}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(i)}>
                                    <X className="text-destructive h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}

// ================= KASIR PAGE ===================
export default function Kasir() {
    const [lists, setLists] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [total, setTotal] = useState(0);
    const [isStokValid, setIsStokValid] = useState(true);

    const fetchData = async () => {
        try {
            const response = await fetch('/barangs/kasir');
            const data = await response.json();
            setTableData(data);
        } catch (error) {
            console.error('Error fetching barang:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (amount) => {
        const [integerPart, decimalPart] = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 })
            .format(amount)
            .split(',');
        return (
            <span>
                {integerPart}
                <span className="align-super text-sm">{`,` + decimalPart}</span>
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Transaksi">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <Card className="grid grid-cols-12 px-4 lg:col-span-2">
                    <ComboboxDemo className="col-span-12 lg:col-span-10" merks={tableData} setSelectedItem={setSelectedItem} />
                    <Button
                        className={`col-span-12 lg:col-span-2 ${selectedItem === null ? 'hidden' : ''}`}
                        onClick={() => {
                            const event = new CustomEvent('addList', { detail: selectedItem });
                            window.dispatchEvent(event);
                            setSelectedItem(null);
                        }}
                    >
                        Tambah
                    </Button>
                </Card>
                <Card className="order-first col-span-1 flex flex-col items-center justify-center px-4 text-3xl font-semibold lg:order-none">
                    {formatCurrency(total)}
                    {!isStokValid && (
                        <Popover>
                            <PopoverTrigger className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                <AlertCircle size={18} /> Stok Tidak Sesuai
                            </PopoverTrigger>
                            <PopoverContent className="w-auto text-sm text-red-500">Cek jumlah yang melebihi stok.</PopoverContent>
                        </Popover>
                    )}
                </Card>
            </div>

            <Card className="max-h-[30rem] overflow-y-auto p-4">
                <Cart setTotal={setTotal} lists={lists} setLists={setLists} setIsStokValid={setIsStokValid} />
            </Card>

            <Button
                disabled={!isStokValid || total <= 0}
                className="col-span-12 text-2xl font-semibold lg:col-span-2"
                onClick={() => {
                    router.post(
                        '/kasir',
                        { lists },
                        {
                            onSuccess: () => {
                                DispatchAlert({ status: true, obj: 'Penjualan', text: 'disimpan' });
                                setSelectedItem(null);
                                setTotal(0);
                                setLists([]);
                            },
                            onError: () => {
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
