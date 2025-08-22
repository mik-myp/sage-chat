import {
  Pencil,
  MoreHorizontal,
  Trash2,
  Plus,
  FolderClosed,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GROUPS_BASE_URL } from '../lib/utils';
import { useGroupsStore, type GroupInfo } from '../store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

const formSchema = z.object({
  groupName: z.string().refine((val) => val.trim() !== '', {
    message: '分组名称不能为空'
  })
});

export default function NavGroups() {
  const { isMobile } = useSidebar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'delete'>(
    'add'
  );
  const [open, setOpen] = useState(false);
  const [actionData, setActionData] = useState<GroupInfo>({} as GroupInfo);
  const { groups, addGroup, deleteGroup, updateGroup, fetchGroups } =
    useGroupsStore();

  // 根据dialogType动态决定是否需要验证
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: ''
    }
  });

  // 使用store中的方法处理分组操作
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (dialogType === 'delete') {
      // 调用store中的deleteGroup方法
      await deleteGroup(actionData.id);
      if (location.pathname.includes(actionData.id)) {
        navigate('/');
      }
    } else if ('groupName' in values && typeof values.groupName === 'string') {
      if (actionData.id) {
        // 调用store中的updateGroup方法
        await updateGroup(actionData.id, values.groupName);
      } else {
        // 调用store中的addGroup方法
        await addGroup(values.groupName);
      }
    }

    form.reset();
    setOpen(false);
    fetchGroups();
  };

  // 使用store中的fetchGroups方法获取分组列表
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) form.reset();
      setOpen(open);
    },
    [form]
  );

  const beforeAdd = useCallback(() => {
    setDialogType('add');
    setActionData({} as GroupInfo);
  }, []);

  const beforeEdit = useCallback(
    (groupInfo: GroupInfo) => {
      setDialogType('edit');
      setActionData(groupInfo);
      form.setValue('groupName', groupInfo.name);
    },
    [form]
  );

  const beforeDelete = useCallback((groupInfo: GroupInfo) => {
    setDialogType('delete');
    setActionData(groupInfo);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
        <SidebarGroupLabel className='flex justify-between'>
          <span>{t('group')}</span>
          <DialogTrigger asChild onClick={beforeAdd}>
            <Plus className='cursor-pointer' />
          </DialogTrigger>
        </SidebarGroupLabel>
        <SidebarMenu>
          {groups.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <NavLink to={`${GROUPS_BASE_URL}/${item.id}`}>
                  <FolderClosed />
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
                  <DialogTrigger asChild onClick={() => beforeEdit(item)}>
                    <DropdownMenuItem>
                      <Pencil className='text-muted-foreground' />
                      <span>{t('edit')}</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  {/* <DropdownMenuItem>
                  <Share className='text-muted-foreground' />
                  <span>{t('share')}</span>
                </DropdownMenuItem> */}
                  <DialogTrigger asChild onClick={() => beforeDelete(item)}>
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
        <Form {...form}>
          {/* 对删除操作使用自定义处理函数，完全绕过表单验证 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (dialogType === 'delete') {
                // 删除操作时直接调用处理函数，不经过表单验证
                onSubmit(form.getValues());
              } else {
                // 非删除操作时使用表单验证
                form.handleSubmit(onSubmit)();
              }
            }}
            className='space-y-8'
          >
            {dialogType !== 'delete' && (
              <FormField
                control={form.control}
                name='groupName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分组名称</FormLabel>
                    <FormControl>
                      <Input placeholder='请输入分组名称' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {dialogType === 'add' && (
              <div className='my-3 flex flex-col gap-2 text-sm'>
                <div className='text-(--muted-foreground)'>什么是分组？</div>
                <div className='text-(--muted-foreground)'>
                  分组功能支持对话分类管理，并通过专属指令定制回复，使交流更专注，个性化且持续发展
                </div>
              </div>
            )}
            {dialogType === 'delete' && (
              <div className='text-sm text-(--muted-foreground)'>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
