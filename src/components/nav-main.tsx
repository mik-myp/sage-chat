'use client';

import { BookmarkCheck, Grid2x2Plus, type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';

export default function NavMain() {
  const items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[] = [
    {
      title: '全部应用',
      url: '/list',
      icon: Grid2x2Plus
    },
    {
      title: '全部收藏',
      url: '/favorites',
      icon: BookmarkCheck
    }
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <NavLink to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
