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
import { Button } from '@/components/ui/button';
import { formatPhone } from '@/lib/utils';

import { Switch } from '@/components/ui/switch';
import { useTheme } from './theme-provider';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store';

export default function NavUser() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const { theme, setTheme } = useTheme();
  const { logout, userInfo } = useUserStore();

  const user: {
    username: string;
    email: string;
    avatar: string;
  } = {
    username: userInfo?.username || '',
    email: userInfo?.email || '',
    avatar: 'https://github.com/shadcn.png'
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (lang === 'system') {
      lang = navigator.language || 'zh-CN';
    }
    i18n.changeLanguage(lang);
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
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.username}</span>
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
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {user.username}
                    </span>
                    <span className='truncate text-xs'>{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Settings />
                    {t('systemSetting')}
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>{t('systemSetting')}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue='setting'>
          <TabsList className='w-full'>
            <TabsTrigger value='setting'>{t('generalSetting')}</TabsTrigger>
            <TabsTrigger value='account'>{t('accountManagement')}</TabsTrigger>
            <TabsTrigger value='agreement'>{t('serviceAgreement')}</TabsTrigger>
          </TabsList>
          <TabsContent value='setting'>
            <Cell
              title={t('language')}
              description={
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className='w-27'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='en-US'>English</SelectItem>
                    <SelectItem value='zh-CN'>中文</SelectItem>
                    <SelectItem value='system'>跟随系统</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
            <Cell
              title={t('theme')}
              description={
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className='w-27'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>{t('浅色')}</SelectItem>
                    <SelectItem value='dark'>{t('深色')}</SelectItem>
                    <SelectItem value='system'>{t('跟随系统')}</SelectItem>
                  </SelectContent>
                </Select>
              }
              isLast
            />
          </TabsContent>
          <TabsContent value='account'>
            <Cell
              title={t('phoneNumber')}
              description={formatPhone('17671812132')}
            />
            <Cell
              title={t('dataUsage')}
              subTitle={t('dataUsageDescription')}
              description={<Switch />}
            />
            <Cell
              title={t('exportHistory')}
              subTitle={t('exportHistoryDescription')}
              description={<Button variant='outline'>{t('export')}</Button>}
            />
            <Cell
              title={t('logoutAllDevices')}
              description={
                <Button variant='outline'>{t('logoutAction')}</Button>
              }
            />
            <Cell
              title={t('deleteAllChats')}
              description={<Button variant='destructive'>{t('delete')}</Button>}
            />
            <Cell
              title={t('deleteAccount')}
              isLast
              description={
                <Button variant='destructive'>{t('cancelAccount')}</Button>
              }
            />
          </TabsContent>
          <TabsContent value='agreement'>
            <Cell
              title={t('userAgreement')}
              description={<Button variant='outline'>{t('view')}</Button>}
            />
            <Cell
              title={t('privacyPolicy')}
              isLast
              description={<Button variant='outline'>{t('view')}</Button>}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
