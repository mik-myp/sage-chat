import { Pencil, MoreHorizontal, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

export default function NavChats() {
  const chats: {
    name: string;
    url: string;
  }[] = [
    {
      name: 'AI产品命名及配色设计',
      url: '#'
    },
    {
      name: 'React脚手架创建项目推荐',
      url: '#'
    },
    {
      name: '心流开放平台功能介绍',
      url: '#'
    },
    {
      name: 'Duxapp小程序接口真机调试问题',
      url: '#'
    },
    {
      name: '前端接入免费DeepSeek问答方案',
      url: '#'
    },
    {
      name: 'React相关框架解析',
      url: '#'
    },
    {
      name: '前端React框架及组件库整理',
      url: '#'
    },
    {
      name: '类似60s API的替代平台',
      url: '#'
    },
    {
      name: '前端开发设计协作应用',
      url: '#'
    },
    {
      name: 'JavaScript数组方法总结',
      url: '#'
    },
    {
      name: 'JS四种集合类型对比',
      url: '#'
    },
    {
      name: 'WebSocket/SSE实现打字效果',
      url: '#'
    },
    {
      name: '多数据源虚拟滚动方案',
      url: '#'
    },
    {
      name: 'GitHub开源API资源查询',
      url: '#'
    },
    {
      name: 'React状态管理库分析',
      url: '#'
    },
    {
      name: 'React表格虚拟滚动实现',
      url: '#'
    },
    {
      name: 'AI问答系统技术方案',
      url: '#'
    },
    {
      name: '设计模式及实例说明',
      url: '#'
    },
    {
      name: 'React ECharts分页加载实现',
      url: '#'
    },
    {
      name: '面试回答Webpack与Vite区别',
      url: '#'
    },
    {
      name: '外包公司分类及代表',
      url: '#'
    },
    {
      name: 'H5响应式布局实现方法',
      url: '#'
    },
    {
      name: '产品开发与AI落地优化',
      url: '#'
    },
    {
      name: 'Vue3移动端组件库推荐',
      url: '#'
    },
    {
      name: '前端开发App框架推荐',
      url: '#'
    },
    {
      name: '理解公司价值观事例说明',
      url: '#'
    },
    {
      name: 'APP功能与架构优化',
      url: '#'
    },
    {
      name: '无法读取文件需更新',
      url: '#'
    },
    {
      name: '本周工作完成与计划',
      url: '#'
    },
    {
      name: 'Webpack打包iOS兼容问题',
      url: '#'
    },
    {
      name: 'HBuilderX设置状态栏背景色',
      url: '#'
    },
    {
      name: '阿里云STS文件预览权限问题',
      url: '#'
    },
    {
      name: 'Android JSBridge接口解析',
      url: '#'
    },
    {
      name: 'Vue3项目接入飞书登录方案',
      url: '#'
    },
    {
      name: 'Uni-app接入飞书登录方法',
      url: '#'
    },
    {
      name: 'Vite配置JS资源打包类型',
      url: '#'
    },
    {
      name: 'Vue3脚手架创建Webpack项目',
      url: '#'
    },
    {
      name: 'Webpack配置迁移至Vite方案',
      url: '#'
    },
    {
      name: '使用Vite创建Vue2项目步骤',
      url: '#'
    },
    {
      name: 'Vite与Webpack创建Vue项目',
      url: '#'
    }
  ];

  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>聊天</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal className='cursor-pointer' />
                  <span className='sr-only'>更多</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-36'
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <Pencil className='text-muted-foreground' />
                  <span>编辑</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Share className='text-muted-foreground' />
                  <span>分享</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Trash2 className='text-red-500' />
                  <span className='text-red-500'>删除</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
