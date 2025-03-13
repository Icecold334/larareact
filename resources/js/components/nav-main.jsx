import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items }) {
    const page = usePage();
    const updatedItems = items.map((item) => ({
        ...item,
        isActive: item.items ? item.items.some((child) => child.url === page.url) : false,
    }));

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {updatedItems.map((i) => {
                    if (i.hasOwnProperty('items')) {
                        return (
                            <Collapsible key={i.title} asChild defaultOpen={i.isActive} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={i.title}>
                                            {i.icon && <i.icon />}
                                            <span>{i.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {i.items?.map((subItem) => (
                                                <SidebarMenuItem key={subItem.title}>
                                                    <SidebarMenuButton asChild isActive={subItem.url === page.url}>
                                                        <Link href={subItem.url} prefetch>
                                                            {subItem.icon && <subItem.icon />}
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    } else {
                        return (
                            <SidebarMenuItem key={i.title}>
                                <SidebarMenuButton asChild isActive={i.url === page.url}>
                                    <Link href={i.url} prefetch>
                                        {i.icon && <i.icon />}
                                        <span>{i.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
