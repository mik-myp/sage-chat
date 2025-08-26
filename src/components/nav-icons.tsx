import { MessageCirclePlus } from 'lucide-react';
import { Button } from './ui/button';

import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './ui/sidebar';
import { useChatsStore } from '../store';

const NavIcons = () => {
  const navigate = useNavigate();
  const { chats, addChat } = useChatsStore();
  return (
    <div className='flex items-start gap-2 mx-2 mt-2 text-sm'>
      <Button
        variant='ghost'
        size='icon'
        className='size-7'
        onClick={async () => {
          const { id } = await addChat(`新对话${chats.length + 1}`);
          navigate(`/chats/${id}`);
        }}
      >
        <MessageCirclePlus />
      </Button>
      <SidebarTrigger />
    </div>
  );
};

export default NavIcons;
