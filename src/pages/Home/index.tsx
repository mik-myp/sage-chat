import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
  SidebarProvider
} from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect } from 'react';
import { useUserStore } from '../../store';

export default function HomeWrapper() {
  const { isLoggedIn } = useUserStore();

  if (!isLoggedIn) {
    return <Navigate to='/login' />;
  }

  return (
    <SidebarProvider>
      <Home />
    </SidebarProvider>
  );
}
function Home() {
  const { state, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const location = useLocation();

  // 手机端修改路由时关闭侧边栏
  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [location, isMobile, setOpenMobile]);

  return (
    <ThemeProvider defaultTheme='system' storageKey='sage-chat-theme'>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-13 shrink-0 items-center gap-2 border-b border-gray-200 border-solid'>
          {(state === 'collapsed' || isMobile) && (
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
            </div>
          )}
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min'>
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </ThemeProvider>
  );
}
