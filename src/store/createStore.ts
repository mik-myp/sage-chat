import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware/persist';

/**
 * 创建store的通用函数，添加一些通用功能
 */
export const createStore = <T>(
  initializer: (
    set: StoreApi<T>['setState'],
    get: StoreApi<T>['getState'],
    api: StoreApi<T>
  ) => T,
  storeName: string
): UseBoundStore<StoreApi<T>> => {
  // 定义persist配置的类型
  const persistConfig: PersistOptions<T, T> = {
    name: `sage-chat-${storeName}`,
    partialize: (state: T) => state
  };

  return create<T>()(persist(initializer, persistConfig));
};
