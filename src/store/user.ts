import { createStore } from './createStore';

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
export const useUserStore = createStore<UserState>((set, get) => ({
  // 初始状态
  userInfo: null,
  isLoggedIn: false,

  // 设置用户信息
  setUserInfo: (userInfo: UserInfo | null) => {
    set({
      userInfo,
      isLoggedIn: !!userInfo
    });

    // 保存到本地存储
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  },

  // 登录
  login: (userInfo: UserInfo) => {
    set({
      userInfo,
      isLoggedIn: true
    });
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  },

  // 登出
  logout: () => {
    set({
      userInfo: null,
      isLoggedIn: false
    });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  },

  // 更新用户信息
  updateUserInfo: (partialUserInfo: Partial<UserInfo>) => {
    const currentUserInfo = get().userInfo;
    if (currentUserInfo) {
      const updatedUserInfo = { ...currentUserInfo, ...partialUserInfo };
      set({ userInfo: updatedUserInfo });
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }
  }
}));

// 初始化时从本地存储加载用户信息
try {
  const savedUserInfo = localStorage.getItem('userInfo');
  if (savedUserInfo) {
    const userInfo = JSON.parse(savedUserInfo);
    useUserStore.getState().setUserInfo(userInfo);
  }
} catch (error) {
  console.error('Failed to load user info from localStorage:', error);
}
