import { createStore } from './createStore';
import { clearPersistAndRedirect } from '../lib/clearPersistStore';

/**
 * 用户信息接口
 */
export interface UserInfo {
  username: string;
  email: string;
}

/**
 * 用户状态接口
 */
export interface UserState {
  // 用户信息
  userInfo: UserInfo | null;
  // 是否已登录
  isLoggedIn: boolean;
  // 设置用户信息
  setUserInfo: (userInfo: UserInfo | null) => void;
  // 登录
  login: (userInfo: UserInfo) => void;
  // 登出
  logout: () => void;
  // 更新用户信息
  updateUserInfo: (partialUserInfo: Partial<UserInfo>) => void;
}

/**
 * 用户状态store
 */
export const useUserStore = createStore<UserState>(
  (set, get) => ({
    // 初始状态
    userInfo: null,
    isLoggedIn: false,

    // 设置用户信息
    setUserInfo: (userInfo: UserInfo | null) => {
      set({
        userInfo,
        isLoggedIn: !!userInfo
      });
    },

    // 登录
    login: (userInfo: UserInfo) => {
      set({
        userInfo,
        isLoggedIn: true
      });
    },

    // 登出
    logout: () => {
      set({
        userInfo: null,
        isLoggedIn: false
      });
      // 使用专用工具函数清除所有Zustand持久化存储并重定向到登录页
      clearPersistAndRedirect({
        refresh: true
      });
    },

    // 更新用户信息
    updateUserInfo: (partialUserInfo: Partial<UserInfo>) => {
      const currentUserInfo = get().userInfo;
      if (currentUserInfo) {
        const updatedUserInfo = { ...currentUserInfo, ...partialUserInfo };
        set({ userInfo: updatedUserInfo });
      }
    }
  }),
  'user'
);
