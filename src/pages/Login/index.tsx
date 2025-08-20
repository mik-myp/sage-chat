import { LoginForm } from '@/components/login-form';
import { useEffect } from 'react';
import { useUserStore } from '../../store';
export default function LoginPage() {
  const { logout } = useUserStore();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className='bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
}
