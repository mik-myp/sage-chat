import { GalleryVerticalEnd } from 'lucide-react';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUserStore } from '../store';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  username: z.string().min(2, {
    message: '用户名不能少于2个字符'
  }),
  email: z.email({
    message: '请输入正确的邮箱地址'
  })
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { login } = useUserStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: ''
    }
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    login(values);
    // 登录成功后跳转到首页
    navigate('/');
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Form {...form}>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex size-8 items-center justify-center rounded-md'>
            <GalleryVerticalEnd className='size-6' />
          </div>
          <span className='sr-only'>Sage Chat</span>
          <h1 className='text-xl font-bold'>欢迎来到 Sage Chat</h1>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input placeholder='请输入邮箱' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input placeholder='请输入用户名' {...field} />
                </FormControl>
                <FormDescription>这是您的公开显示名称。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full'>
            登录
          </Button>
        </form>
      </Form>
    </div>
  );
}
