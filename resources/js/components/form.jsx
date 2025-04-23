'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

import DispatchAlert from '@/components/dispatch-alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { z } from 'zod';

export default function ({ obj, cols }) {
    const formSchema = z.object({
        ...cols.cols.reduce((acc, col) => {
            let schema;

            if (col.type === 'number') {
                schema = z.preprocess((val) => Number(val), z.number().int().min(1, `${col.col} harus lebih dari 0`));
            } else if (col.type === 'select') {
                schema = z.string().refine((val) => val !== '0', {
                    message: `Silakan pilih ${col.col}`,
                });
            } else {
                schema = z.string();
                if (col.min) {
                    schema = schema.min(col.min, {
                        message: `${col.col.charAt(0).toUpperCase() + col.col.slice(1)} harus minimal ${col.min} karakter.`,
                    });
                }
            }

            schema = schema.nullable().optional();
            acc[col.col] = schema;
            return acc;
        }, {}),
        id: z.number().int().nullable().optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...cols.cols.reduce((acc, col) => {
                acc[col.col] = obj?.[col.col] ?? (col.type === 'text' ? '' : col.type === 'number' ? 0 : col.type === 'select' ? '0' : null);
                return acc;
            }, {}),
            id: obj?.id ?? null,
        },
    });

    async function onSubmit(values) {
        const formattedValues = {
            ...values,
            ...cols.cols
                .filter((col) => col.rupiah)
                .reduce((acc, col) => {
                    acc[col.col] = values[col.col] ? Number(values[col.col].replace(/[^\d]/g, '')) : 0;
                    return acc;
                }, {}),
        };

        if (values.id) {
            router.put(`/${cols.href}/${values.id}`, formattedValues, {
                onSuccess: () => DispatchAlert({ status: true, obj: cols.table, text: 'diubah' }),
                onError: () => DispatchAlert({ status: false, obj: cols.table, text: 'diubah' }),
            });
        } else {
            router.post(`/${cols.href}`, formattedValues, {
                onSuccess: () => DispatchAlert({ status: true, obj: cols.table, text: 'disimpan' }),
                onError: () => DispatchAlert({ status: false, obj: cols.table, text: 'disimpan' }),
            });
        }
    }

    function formatRupiah(value) {
        if (!value) return '';
        const numberString = value.replace(/[^\d]/g, '');
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(numberString);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-3">
                {cols.cols.map((col) => (
                    <FormField
                        key={col.col}
                        control={form.control}
                        name={col.col}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{col.col.charAt(0).toUpperCase() + col.col.slice(1)}</FormLabel>
                                <FormControl>
                                    {col.type === 'textarea' ? (
                                        <Textarea placeholder={`Masukkan ${col.col}`} {...field} autoComplete="off" />
                                    ) : col.type === 'select' ? (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Pilih ${col.col}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(col.options || []).map((option) => {
                                                    return (
                                                        <SelectItem key={option.id} value={option.id}>
                                                            {option.nama}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    ) : col.rupiah ? (
                                        <Input
                                            type="text"
                                            placeholder={`Masukkan ${col.col}`}
                                            value={field.value ? formatRupiah(field.value) : ''}
                                            onChange={(e) => {
                                                field.onChange(e.target.value.replace(/[^\d]/g, ''));
                                            }}
                                            autoComplete="off"
                                        />
                                    ) : (
                                        <Input
                                            type={col.type === 'number' ? 'number' : 'text'}
                                            placeholder={`Masukkan ${col.col}`}
                                            {...field}
                                            autoComplete="off"
                                        />
                                    )}
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                ))}
                <Button type="submit">Simpan</Button>
            </form>
        </Form>
    );
}
