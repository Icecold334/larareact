'use client';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface AppLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, title, ...props }: AppLayoutProps) => {
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        const handlePostCreated = (event: Event) => {
            const data = (event as CustomEvent).detail;
            MySwal.fire({
                title: data.title,
                text: data.text,
                icon: data.icon,
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        };

        window.addEventListener('alert', handlePostCreated);

        return () => {
            window.removeEventListener('alert', handlePostCreated);
        };
    });
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Head title={title} />
                {children}
            </div>
        </AppLayoutTemplate>
    );
};
