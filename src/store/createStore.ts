import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 创建store的通用函数，添加一些通用功能
 */
export const createStore = <T>(
  initializer: (
    set: StoreApi<T>['setState'],
    get: StoreApi<T>['getState'],
    api: StoreApi<T>
  ) => T
): UseBoundStore<StoreApi<T>> => {
  return create<T>()(
    persist(initializer, {
      name: 'sage-chat-storage',
      partialize: (state) => state
    })
  );
};
