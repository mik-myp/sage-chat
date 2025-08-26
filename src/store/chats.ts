import { createStore } from './createStore';
import { getUUID } from '../lib/utils';

export interface MessageInfo {
  role: string;
  content: string;
  thinkingContent?: string;
}

export interface ChatInfo {
  name: string;
  id: string;
  messages: MessageInfo[];
}

export interface ChatsState {
  // 聊天列表
  chats: ChatInfo[];
  // 设置聊天
  setChats: (chats: ChatInfo[]) => void;
  // 添加聊天
  addChat: (chatName: string) => Promise<ChatInfo>;
  // 删除聊天
  deleteChat: (chatId: string) => void;
  // 更新聊天
  updateChat: (
    chatId: string,
    { chatName, messages }: { chatName: string; messages?: MessageInfo[] }
  ) => Promise<void>;
  // 清空聊天
  clearChats: () => void;
}

export const useChatsStore = createStore<ChatsState>(
  (set, get) => ({
    chats: [{ name: '默认聊天', id: getUUID(), messages: [] }],
    setChats: (chats: ChatInfo[]) => {
      set({ chats });
    },
    addChat: async (chatName: string) => {
      const newChat = { name: chatName, id: getUUID(), messages: [] };
      set({
        chats: [...get().chats, newChat]
      });
      return newChat;
    },
    deleteChat: async (chatId: string) => {
      set({ chats: get().chats.filter((chat) => chat.id !== chatId) });
    },
    updateChat: async (
      chatId: string,
      { chatName, messages }: { chatName: string; messages?: MessageInfo[] }
    ) => {
      set({
        chats: get().chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                name: chatName,
                messages: messages || chat.messages || []
              }
            : chat
        )
      });
    },
    clearChats: () => {
      set({ chats: [] });
    }
  }),
  'chats'
);
