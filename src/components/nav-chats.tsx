import {
  Pencil,
  MoreHorizontal,
  Trash2,
  Plus,
  MessageSquare,
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
import { useCallback, useState } from 'react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { CHATS_BASE_URL } from '../lib/utils';
import { useChatsStore, type ChatInfo } from '../store/chats';
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

export default function NavChats() {
  const { isMobile } = useSidebar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'delete'>(
    'add'
  );
  const [open, setOpen] = useState(false);
  const [actionData, setActionData] = useState<ChatInfo>({} as ChatInfo);
  const { chats, addChat, deleteChat, updateChat } = useChatsStore();

  const formSchema = z.object({
    chatName: z.string().refine((val) => val.trim() !== '', {
      message: '聊天名称不能为空'
    })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatName: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (dialogType === 'delete') {
      await deleteChat(actionData.id);
      if (location.pathname.includes(actionData.id)) {
        navigate('/');
      }
    } else if ('chatName' in values && typeof values.chatName === 'string') {
      if (actionData.id) {
        await updateChat(actionData.id, { chatName: values.chatName });
      } else {
        const { id } = await addChat(values.chatName);
        navigate(`/chats/${id}`);
      }
    }

    form.reset();
    setOpen(false);
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) form.reset();
      setOpen(open);
    },
    [form]
  );

  const beforeAdd = useCallback(() => {
    setDialogType('add');
    setActionData({} as ChatInfo);
  }, []);

  const beforeEdit = useCallback(
    (chatInfo: ChatInfo) => {
      setDialogType('edit');
      setActionData(chatInfo);
      form.setValue('chatName', chatInfo.name);
    },
    [form]
  );

  const beforeDelete = useCallback((chatInfo: ChatInfo) => {
    setDialogType('delete');
    setActionData(chatInfo);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
        <SidebarGroupLabel className='flex justify-between'>
          <span>{t('chat')}</span>
          <DialogTrigger asChild onClick={beforeAdd}>
            <Plus className='cursor-pointer' />
          </DialogTrigger>
        </SidebarGroupLabel>
        <SidebarMenu>
          {chats.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <NavLink to={`${CHATS_BASE_URL}/${item.id}`}>
                  <MessageSquare className='mr-2' />
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
            {
              {
                add: '新建聊天',
                edit: '编辑聊天名称',
                delete: '确认删除'
              }[dialogType]
            }
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (dialogType === 'delete') {
                onSubmit(form.getValues());
              } else {
                form.handleSubmit(onSubmit)();
              }
            }}
            className='space-y-8'
          >
            {dialogType !== 'delete' && (
              <FormField
                control={form.control}
                name='chatName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>聊天名称</FormLabel>
                    <FormControl>
                      <Input placeholder='请输入聊天名称' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {dialogType === 'delete' && (
              <div className='text-sm text-muted-foreground'>
                该聊天被删除后无法恢复，确认删除吗？
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
                {
                  {
                    add: '创建',
                    edit: '确认',
                    delete: '删除'
                  }[dialogType]
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
