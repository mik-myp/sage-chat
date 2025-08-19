import { useState } from 'react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/components/ui/command';
import { chats } from '@/lib/chats';
import { NavLink } from 'react-router-dom';
import { CHATS_BASE_URL } from '../lib/utils';
const NavSearch = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className='flex items-center gap-2 mx-2 py-1.5 px-2 cursor-pointer rounded-lg border-[0.5px] border-solid border-[#00000014] bg-[#0000000d] hover:bg-[#00000014] text-[#00000066] text-sm'
      >
        <Search size={20} />
        <span>搜索</span>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='搜索对话' />
        <CommandList>
          <CommandEmpty>未找到结果。</CommandEmpty>
          <CommandGroup heading='操作'>
            <NavLink to={'/'} onClick={() => setOpen(false)}>
              <CommandItem className='cursor-pointer'>新建对话</CommandItem>
            </NavLink>
          </CommandGroup>
          <CommandGroup heading='对话'>
            {chats.map((item) => {
              return (
                <NavLink
                  to={`${CHATS_BASE_URL}/${item.id}`}
                  onClick={() => setOpen(false)}
                >
                  <CommandItem key={item.id} className='cursor-pointer'>
                    {item.name}
                  </CommandItem>
                </NavLink>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default NavSearch;
