import { createStore } from './createStore';
import request from '../lib/request';

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
  addGroup: (groupName: string) => Promise<void>;
  // 删除分组
  deleteGroup: (groupId: string) => Promise<void>;
  // 更新分组
  updateGroup: (groupId: string, groupName: string) => Promise<void>;
  // 获取分组列表
  fetchGroups: () => Promise<void>;
}

export const useGroupsStore = createStore<GroupsState>(
  (set, get) => ({
    groups: [],
    setGroups: (groups: GroupInfo[]) => {
      set({ groups });
    },
    // 添加分组
    addGroup: async (groupName: string) => {
      const res = await request<{ data: GroupInfo }>('/addGroup', {
        method: 'POST',
        data: { groupName }
      });

      if (res.data && 'name' in res.data && 'id' in res.data) {
        set({ groups: [...get().groups, res.data as GroupInfo] });
      }
    },
    // 删除分组
    deleteGroup: async (groupId: string) => {
      await request(`/groups/${groupId}`, {
        method: 'DELETE'
      });

      set({ groups: get().groups.filter((group) => group.id !== groupId) });
    },
    // 更新分组
    updateGroup: async (groupId: string, groupName: string) => {
      const res = await request<{ data: GroupInfo }>('/editGroup', {
        method: 'POST',
        data: { id: groupId, groupName }
      });

      if (res.data && 'name' in res.data && 'id' in res.data) {
        set({
          groups: get().groups.map((group) =>
            group.id === groupId ? (res.data as unknown as GroupInfo) : group
          )
        });
      }
    },
    // 获取分组列表
    fetchGroups: async () => {
      const res = await request<{ groups: GroupInfo[] }>('/groups');
      set({ groups: res.groups });
    }
  }),
  'groups'
);
