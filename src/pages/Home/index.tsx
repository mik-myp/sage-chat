import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { Outlet } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
export default function Home() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <ThemeProvider defaultTheme='system' storageKey='sage-chat-theme'>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-13 shrink-0 items-center gap-2 border-b border-gray-200 border-solid'>
          {(state === 'collapsed' || isMobile) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='flex items-center gap-2 px-4'>
                  <SidebarTrigger className='-ml-1' />
                </div>
              </TooltipTrigger>
              <TooltipContent>展开侧栏</TooltipContent>
            </Tooltip>
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
