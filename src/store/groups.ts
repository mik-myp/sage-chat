import { createStore } from './createStore';
import { getUUID } from '../lib/utils';

export interface GroupInfo {
  name: string;
  id: string;
}

export interface GroupsState {
  // 分组列表
  groups: GroupInfo[];
  // 设置分组
  setGroups: (groups: GroupInfo[]) => void;
  // 添加分组
  addGroup: (groupName: string) => void;
  // 删除分组
  deleteGroup: (groupId: string) => void;
  // 更新分组
  updateGroup: (groupId: string, groupName: string) => void;
}

export const useGroupsStore = createStore<GroupsState>(
  (set, get) => ({
    groups: [{ name: '默认分组', id: getUUID() }],
    setGroups: (groups: GroupInfo[]) => {
      set({ groups });
    },
    // 添加分组
    addGroup: async (groupName: string) => {
      set({
        groups: [
          ...get().groups,
          {
            name: groupName,
            id: getUUID()
          }
        ]
      });
    },
    // 删除分组
    deleteGroup: async (groupId: string) => {
      set({ groups: get().groups.filter((group) => group.id !== groupId) });
    },
    // 更新分组
    updateGroup: async (groupId: string, groupName: string) => {
      set({
        groups: get().groups.map((group) =>
          group.id === groupId ? { ...group, name: groupName } : group
        )
      });
    }
  }),
  'groups'
);
