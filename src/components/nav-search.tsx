import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { NavLink, useNavigate } from 'react-router-dom';
import { CHATS_BASE_URL } from '../lib/utils';
import { useChatsStore } from '../store';
const NavSearch = () => {
  const [open, setOpen] = useState(false);

  const { chats, addChat } = useChatsStore();
  const navigate = useNavigate();

  const handleAddChat = async () => {
    const { id } = await addChat(`新对话${chats.length + 1}`);
    navigate(`/chats/${id}`);
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className='flex items-center gap-2 mx-2 py-1.5 px-2 cursor-pointer rounded-lg border-[0.5px] border-solid border-border bg-muted hover:bg-accent text-muted-foreground text-sm'
      >
        <Search size={20} />
        <span>搜索</span>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='搜索对话' />
        <CommandList>
          <CommandEmpty>未找到结果。</CommandEmpty>
          <CommandGroup heading='操作'>
            <div onClick={handleAddChat}>
              <CommandItem className='cursor-pointer'>新建对话</CommandItem>
            </div>
          </CommandGroup>
          {chats.length ? (
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
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default NavSearch;
