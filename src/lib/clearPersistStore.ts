/**
 * 清除Zustand persist持久化存储的工具函数
 */

/**
 * 清除所有以'sage-chat-'为前缀的持久化存储
 */
export const clearAllPersistStores = (): void => {
  // 获取所有本地存储的键
  const allKeys = Object.keys(localStorage);

  // 过滤出所有以'sage-chat-'为前缀的键并删除
  allKeys.forEach((key) => {
    if (key.startsWith('sage-chat-')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * 清除特定名称的持久化存储
 * @param storeNames 要清除的store名称数组
 */
export const clearSpecificPersistStores = (storeNames: string[]): void => {
  storeNames.forEach((storeName) => {
    const key = `sage-chat-${storeName}`;
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * 清除持久化存储并可选地刷新页面或重定向
 * @param options 清除选项
 * @param options.storeNames 可选，要清除的特定store名称数组
 * @param options.refresh 可选，是否在清除后刷新页面
 * @param options.redirectTo 可选，清除后重定向到的URL
 */
export const clearPersistAndRedirect = (options?: {
  storeNames?: string[];
  refresh?: boolean;
  redirectTo?: string;
}): void => {
  const { storeNames, refresh = false, redirectTo } = options || {};

  if (storeNames && storeNames.length > 0) {
    clearSpecificPersistStores(storeNames);
  } else {
    clearAllPersistStores();
  }

  // 优先使用重定向
  if (redirectTo) {
    // 检查是否已经在目标URL，避免无限重定向
    const isAlreadyAtTarget =
      window.location.pathname === redirectTo ||
      window.location.hash.includes(`#${redirectTo}`) ||
      window.location.hash.includes(`#/${redirectTo}`);

    if (!isAlreadyAtTarget) {
      // 对于hash router，需要使用带有#的URL格式
      const targetUrl = redirectTo.startsWith('#')
        ? redirectTo
        : `#${redirectTo}`;
      window.location.hash = targetUrl;
    }
  }
  // 如果没有指定重定向，则考虑刷新
  else if (refresh) {
    // 检查当前是否已经在登录页面，避免无限刷新循环
    const isLoginPage = window.location.hash.includes('#/login');

    if (!isLoginPage) {
      // 不在登录页面时才刷新，避免无限循环
      window.location.reload();
    }
  }
};

/**
 * 获取所有当前存在的sage-chat持久化存储键
 * @returns 存储键数组
 */
export const getExistingPersistStoreKeys = (): string[] => {
  const allKeys = Object.keys(localStorage);
  return allKeys.filter((key) => key.startsWith('sage-chat-'));
};
