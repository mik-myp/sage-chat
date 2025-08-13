import {
  Pencil,
  MoreHorizontal,
  Trash2,
  Plus,
  FolderClosed,
  type LucideIcon
} from 'lucide-react';

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

export default function NavGroups() {
  const groups: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[] = [
    {
      name: '分组示例',
      url: '#',
      icon: FolderClosed
    }
  ];

  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel className='flex justify-between'>
        <span>分组</span>
        <Plus className='cursor-pointer' />
      </SidebarGroupLabel>
      <SidebarMenu>
        {groups.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal className='cursor-pointer' />
                  <span className='sr-only'>更多</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-36'
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <Pencil className='text-muted-foreground' />
                  <span>编辑</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Share className='text-muted-foreground' />
                  <span>分享</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Trash2 className='text-red-500' />
                  <span className='text-red-500'>删除</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
