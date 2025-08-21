import { createStore } from './createStore';

export interface ChatInfo {
  name: string;
  id: string;
}

export interface ChatsState {
  // 聊天列表
  chats: ChatInfo[];
  // 设置聊天
  setChats: (chats: ChatInfo[]) => void;
  // 添加聊天
  addChat: (chatInfo: ChatInfo) => void;
  // 删除聊天
  deleteChat: (chatId: string) => void;
  // 更新聊天
  updateChat: (chatInfo: ChatInfo) => void;
}

export const useChatsStore = createStore<ChatsState>(
  (set, get) => ({
    chats: [],
    setChats: (chats: ChatInfo[]) => {
      set({ chats });
    },
    addChat: (chatInfo: ChatInfo) => {
      set({ chats: [...get().chats, chatInfo] });
    },
    deleteChat: (chatId: string) => {
      set({ chats: get().chats.filter((chat) => chat.id !== chatId) });
    },
    updateChat: (chatInfo: ChatInfo) => {
      set({
        chats: get().chats.map((chat) =>
          chat.id === chatInfo.id ? chatInfo : chat
        )
      });
    }
  }),
  'chats'
);
