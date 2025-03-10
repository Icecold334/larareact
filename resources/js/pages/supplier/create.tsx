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
    nama: z.string().min(1, {
        message: 'Username must be at least 2 characters.',
    }),
    telepon: z.string().min(1, {
        message: 'Username must be at least 2 characters.',
    }),
    alamat: z.string().min(1, {
        message: 'Username must be at least 2 characters.',
    }),
});

export default function () {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: '',
            alamat: '',
            telepon: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        router.post('/supplier', values);
        const event = new CustomEvent('alert', {
            detail: {
                title: 'Berhasil!',
                icon: 'success',
                text: 'Supplier berhasil disimpan!',
            },
        });
        const refresh = new CustomEvent('refresh', {
            detail: {
                title: 'Berhasil!',
            },
        });
        window.dispatchEvent(event);
        window.dispatchEvent(refresh);
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
