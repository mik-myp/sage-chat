'use client';

import { ChevronsUpDown, LogOut, Settings } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Cell from '@/components/ui/cell';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { formatPhone } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';

export default function NavUser() {
  const [language, setLanguage] = useState('system');
  const { theme, setTheme } = useTheme();

  const user: {
    name: string;
    email: string;
    avatar: string;
  } = {
    name: 'maike',
    email: 'maike@example.com',
    avatar: 'https://github.com/shadcn.png'
  };

  return (
    <Dialog>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
                <ChevronsUpDown className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-48 rounded-lg'
              side={'top'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>{user.name}</span>
                    <span className='truncate text-xs'>{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Settings />
                    系统设置
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem>
                  <LogOut />
                  退出登陆
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>系统设置</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue='setting'>
          <TabsList className='w-full'>
            <TabsTrigger value='setting'>通用设置</TabsTrigger>
            <TabsTrigger value='account'>账号管理</TabsTrigger>
            <TabsTrigger value='agreement'>服务协议</TabsTrigger>
          </TabsList>
          <TabsContent value='setting'>
            <Cell
              title='语言'
              description={
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className='w-27'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='english'>English</SelectItem>
                    <SelectItem value='chinese'>中文</SelectItem>
                    <SelectItem value='system'>跟随系统</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
            <Cell
              title='主题'
              description={
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className='w-27'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>浅色</SelectItem>
                    <SelectItem value='dark'>深色</SelectItem>
                    <SelectItem value='system'>跟随系统</SelectItem>
                  </SelectContent>
                </Select>
              }
              isLast
            />
          </TabsContent>
          <TabsContent value='account'>
            <Cell title='手机号码' description={formatPhone('17671812132')} />
            <Cell
              title='数据用于优化体验'
              subTitle='允许我们将你的对话内容用于优化 DeepSeek 的使用体验。我们保障你的数据隐私安全。'
              description={<Switch />}
            />
            <Cell
              title='导出所有历史对话'
              subTitle='导出内容中将包含你的账号信息和所有历史对话。导出可能需要一段时间，下载链接的有效期为 7 天。'
              description={<Button variant='outline'>导出</Button>}
            />
            <Cell
              title='登出所有设备'
              description={<Button variant='outline'>登出</Button>}
            />
            <Cell
              title='删除所有对话'
              description={<Button variant='destructive'>删除</Button>}
            />
            <Cell
              title='注销账号'
              isLast
              description={<Button variant='destructive'>注销</Button>}
            />
          </TabsContent>
          <TabsContent value='agreement'>
            <Cell
              title='用户协议'
              description={<Button variant='outline'>查看</Button>}
            />
            <Cell
              title='隐私政策'
              isLast
              description={<Button variant='outline'>查看</Button>}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
