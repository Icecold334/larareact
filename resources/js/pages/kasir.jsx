import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

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

const frameworks = [
    {
        value: 'next.js',
        label: 'Next.js',
    },
    {
        value: 'sveltekit',
        label: 'SvelteKit',
    },
    {
        value: 'nuxt.js',
        label: 'Nuxt.js',
    },
    {
        value: 'remix',
        label: 'Remix',
    },
    {
        value: 'astro',
        label: 'Astro',
    },
];

export function ComboboxDemo({ className }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={className + ' justify-between'}>
                    {value ? frameworks.find((framework) => framework.value === value)?.label : 'Pilih Barang'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[30rem] p-0">
                <Command>
                    <CommandInput placeholder="Cari Barang..." className="h-10" />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? '' : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    {framework.label}
                                    <Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default function Kasir() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Transaksi">
            <div className="grid grid-cols-3 gap-6">
                <Card className="col-span-2 grid grid-cols-12 px-4">
                    <ComboboxDemo className="col-span-10" />
                    <Button className="col-span-2">Tambah</Button>
                </Card>
                <Card className="col-span-1 px-4"></Card>
            </div>
        </AppLayout>
    );
}
