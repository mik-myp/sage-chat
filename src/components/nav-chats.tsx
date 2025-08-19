import { Pencil, MoreHorizontal, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { chats } from '@/lib/chats';
import { CHATS_BASE_URL } from '../lib/utils';

export default function NavChats() {
  const { isMobile } = useSidebar();
  const { t } = useTranslation();

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>{t('chat')}</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <NavLink to={`${CHATS_BASE_URL}/${item.id}`}>
                <span>{item.name}</span>
              </NavLink>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal className='cursor-pointer' />
                  <span className='sr-only'>{t('more')}</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-36'
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <Pencil className='text-muted-foreground' />
                  <span>{t('edit')}</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Share className='text-muted-foreground' />
                  <span>{t('share')}</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Trash2 className='text-red-500' />
                  <span className='text-red-500'>{t('delete')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
