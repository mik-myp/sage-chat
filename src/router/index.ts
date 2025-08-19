import { createElement } from 'react';
import { createHashRouter, Navigate, type RouteObject } from 'react-router-dom';
import Home from '@/pages/Home/index.tsx';
import List from '@/pages/List/index.tsx';
import Favorites from '@/pages/Favorites/index.tsx';
import Page403 from '@/pages/Page403/index.tsx';
import Page404 from '@/pages/Page404/index.tsx';
import Groups from '@/pages/Groups';
import Chats from '@/pages/Chats';

const routes: RouteObject[] = [
  {
    path: '/',
    element: createElement(Home),
    children: [
      {
        path: '/list',
        element: createElement(List)
      },
      {
        path: '/favorites',
        element: createElement(Favorites)
      },
      {
        path: '/groups/:id',
        element: createElement(Groups)
      },
      {
        path: '/chats/:id',
        element: createElement(Chats)
      }
    ]
  },
  {
    path: '*',
    element: createElement(Navigate, { to: '/404', replace: true })
  },
  {
    path: '/403',
    element: createElement(Page403)
  },
  {
    path: '/404',
    element: createElement(Page404)
  }
];

export default createHashRouter(routes);
