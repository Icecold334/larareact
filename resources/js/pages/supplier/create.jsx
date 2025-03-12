'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
const formSchema = z.object({
    id: z.number().int().nullable().optional(),
    nama: z.string().min(2, {
        message: 'Nama harus minimal 2 karakter.',
    }),
    telepon: z.string().min(11, {
        message: 'Nomor telepon harus minimal 11 karakter.',
    }),
    alamat: z.string().min(5, {
        message: 'Alamat harus minimal 5 karakter.',
    }),
});

export default function (supplier) {
    const form =
        useForm <
        z.infer <
        typeof formSchema >>
            {
                resolver: zodResolver(formSchema),
                defaultValues: {
                    id: supplier?.id ? Number(supplier.id) : undefined,
                    nama: supplier?.nama || '',
                    alamat: supplier?.alamat || '',
                    telepon: supplier?.telepon || '',
                },
            };
    const showAlert = (status, text) => {
        const event = new CustomEvent('alert', {
            detail: {
                title: status ? 'Berhasil!' : 'Gagal!',
                icon: status ? 'success' : 'error',
                text: `Supplier ${status ? 'berhasil' : 'gagal'} di${text}!`,
                status,
            },
        });
        window.dispatchEvent(event);
    };

    async function onSubmit(values) {
        if (values.id) {
            router.put(`/supplier/${values.id}`, values, {
                onSuccess: () => {
                    showAlert(true, 'diubah');
                },
                onError: () => {
                    showAlert(false, 'diubah');
                },
            });
        } else {
            router.post('/supplier', values, {
                onSuccess: () => {
                    showAlert(true, 'disimpan');
                },
                onError: () => {
                    showAlert(false, 'disimpan');
                },
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-3">
                <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                                <Input placeholder="Nama Supplier" {...field} autoComplete="off" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="telepon"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                                <Input placeholder="Nomor Telepon" {...field} autoComplete="off" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="alamat"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Alamat</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Alamat Supplier" className="" {...field} autoComplete="off" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Simpan</Button>
            </form>
        </Form>
    );
}
