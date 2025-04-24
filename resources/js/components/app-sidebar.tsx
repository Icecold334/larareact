import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import * as Icon from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: (NavItem | NavGroup)[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Icon.LayoutGrid,
    },
    {
        title: 'Transaksi',
        url: '/kasir',
        icon: Icon.CoinsIcon,
    },
    {
        title: 'Pembelian',
        url: '/beli',
        icon: Icon.ShoppingCart,
    },
    {
        title: 'Daftar Supplier',
        url: '/supplier',
        icon: Icon.ClipboardCheck,
    },
    {
        title: 'Daftar Barang',
        url: '/barang',
        icon: Icon.Box,
    },
    // {
    //     title: 'Daftar Merk',
    //     url: '/merk',
    //     icon: Icon.Layers2,
    // },
    {
        title: 'Laporan',
        icon: Icon.BarChart2,
        isActive: false,
        items: [
            {
                title: 'Laporan Pembelian',
                url: '/laporan/beli',
                icon: Icon.FileDown,
            },
            {
                title: 'Laporan Penjualan',
                url: '/laporan/jual',
                icon: Icon.FileUp,
            },
        ],
    },
];
// const mainCollapseNavItems: NavGroup[] = [

// ];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     url: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     url: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
