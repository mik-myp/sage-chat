import { MessageCirclePlus } from 'lucide-react';
import { Button } from './ui/button';

import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './ui/sidebar';

const NavIcons = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-start gap-2 mx-2 mt-2 text-sm'>
      <Button
        variant='ghost'
        size='icon'
        className='size-7'
        onClick={() => {
          navigate('/');
        }}
      >
        <MessageCirclePlus />
      </Button>
      <SidebarTrigger />
    </div>
  );
};

export default NavIcons;
