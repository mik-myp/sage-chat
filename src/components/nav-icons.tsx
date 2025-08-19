import { MessageCirclePlus } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './ui/sidebar';

const NavIcons = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-start gap-2 mx-2 mt-2 text-sm'>
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>新建对话</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger />
        </TooltipTrigger>
        <TooltipContent>收起侧栏</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default NavIcons;
