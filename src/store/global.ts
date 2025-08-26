import { createStore } from './createStore';

/**
 * 全局状态接口
 */
export interface GlobalState {
  aiModel: string;
  setAiModel: (aiModel: string) => void;
}

/**
 * 全局状态store
 */
export const useGlobalStore = createStore<GlobalState>(
  (set) => ({
    // 初始状态
    aiModel: 'DeepSeek-R1',
    // 设置 AI 模型
    setAiModel: (aiModel: string) => {
      set({
        aiModel
      });
    }
  }),
  'global'
);
