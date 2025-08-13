import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';

export default function Page() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='sage-chat-theme'>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='flex h-13 shrink-0 items-center gap-2 border-b border-gray-200 border-solid'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
            </div>
          </header>
          <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
            <div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min'>
              123
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
