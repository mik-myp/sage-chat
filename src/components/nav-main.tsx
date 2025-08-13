'use client';

import { BookmarkCheck, Grid2x2Plus, type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

export default function NavMain() {
  const items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[] = [
    {
      title: '全部应用',
      url: '#',
      icon: Grid2x2Plus
    },
    {
      title: '全部收藏',
      url: '#',
      icon: BookmarkCheck
    }
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
