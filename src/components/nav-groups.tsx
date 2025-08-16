import {
  Pencil,
  MoreHorizontal,
  Trash2,
  Plus,
  FolderClosed,
  type LucideIcon,
  CircleAlert
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface Group {
  name?: string;
  url?: string;
  icon?: LucideIcon;
}

const TitleMap = {
  add: '新建分组',
  edit: '编辑分组名称',
  delete: '确认删除'
};

const SubmitMap = {
  add: '创建',
  edit: '确认',
  delete: '删除'
};

export default function NavGroups() {
  const groups: Group[] = [
    {
      name: '分组示例',
      url: '#',
      icon: FolderClosed
    }
  ];

  const { isMobile } = useSidebar();
  const { t } = useTranslation();

  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'delete'>(
    'add'
  );
  const [actionData, setActionData] = useState<Group>({});

  return (
    <Dialog>
      <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
        <SidebarGroupLabel className='flex justify-between'>
          <span>{t('group')}</span>
          <DialogTrigger
            asChild
            onClick={() => {
              setDialogType('add');
              setActionData({});
            }}
          >
            <Plus className='cursor-pointer' />
          </DialogTrigger>
        </SidebarGroupLabel>
        <SidebarMenu>
          {groups.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.name}</span>
                </a>
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
                  <DialogTrigger
                    asChild
                    onClick={() => {
                      setDialogType('edit');
                      setActionData(item);
                    }}
                  >
                    <DropdownMenuItem>
                      <Pencil className='text-muted-foreground' />
                      <span>{t('edit')}</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  {/* <DropdownMenuItem>
                  <Share className='text-muted-foreground' />
                  <span>{t('share')}</span>
                </DropdownMenuItem> */}
                  <DialogTrigger
                    asChild
                    onClick={() => {
                      setDialogType('delete');
                      setActionData(item);
                    }}
                  >
                    <DropdownMenuItem>
                      <Trash2 className='text-red-500' />
                      <span className='text-red-500'>{t('delete')}</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {dialogType === 'delete' && (
              <CircleAlert className='text-red-500' />
            )}
            {TitleMap[dialogType]}
          </DialogTitle>
        </DialogHeader>
        {dialogType !== 'delete' && (
          <Input
            id='groupName'
            name='groupName'
            placeholder='请输入分组名称'
            defaultValue={actionData.name}
            className='my-3'
          />
        )}
        {dialogType === 'add' && (
          <div className='my-3 flex flex-col gap-2 text-sm'>
            <div className='text-[#00000099]'>什么是分组？</div>
            <div className='text-[#00000066]'>
              分组功能支持对话分类管理，并通过专属指令定制回复，使交流更专注，个性化且持续发展
            </div>
          </div>
        )}
        {dialogType === 'delete' && (
          <div className='text-sm text-[#00000099]'>
            该分组被删除后无法恢复，组内的所有对话与指令也将被一并删除，不可恢复。确认删除吗？
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>取消</Button>
          </DialogClose>
          <Button
            type='submit'
            variant={dialogType === 'delete' ? 'destructive' : 'default'}
          >
            {SubmitMap[dialogType]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
