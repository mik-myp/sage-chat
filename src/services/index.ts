import { createServer, Model } from 'miragejs';
import { getUUID } from '../lib/utils';

// 通用函数：从localStorage获取指定store的数据
const getStoreData = <T>(storeName: string, defaultValue: T): T => {
  try {
    // 尝试从zustand缓存中获取数据
    const zustandKey = `sage-chat-${storeName}`;
    const zustandData = localStorage.getItem(zustandKey);

    if (zustandData) {
      const parsed = JSON.parse(zustandData);
      // 检查是否是预期的格式
      if (parsed && parsed.state && parsed.state[storeName]) {
        return parsed.state[storeName] as T;
      }
    }
  } catch (e) {
    console.error(`Failed to parse saved ${storeName} data:`, e);
  }

  // 如果没有找到有效的缓存数据，返回默认值
  return defaultValue;
};

export default function () {
  createServer({
    models: {
      group: Model
    },

    seeds(server) {
      // 使用localStorage中的数据或默认数据初始化
      const initialGroups = getStoreData<Array<{ name: string; id: string }>>(
        'groups',
        [{ name: '默认分组', id: getUUID() }]
      );
      initialGroups.forEach((group: { name: string; id: string }) => {
        server.create('group', group);
      });
    },
    routes() {
      /** groups */
      this.get('/api/groups', (schema) => {
        return {
          data: {
            groups: schema.db.groups
          },
          code: 0,
          msg: 'success'
        };
      });
      this.post('/api/addGroup', (schema, request) => {
        const { groupName } = JSON.parse(request.requestBody);
        const newGroup = {
          name: groupName,
          id: getUUID()
        };
        schema.db.groups.insert(newGroup);
        return {
          data: newGroup,
          code: 0,
          msg: 'success'
        };
      });
      this.post('/api/editGroup', (schema, request) => {
        const { groupName, id } = JSON.parse(request.requestBody);
        schema.db.groups.update(id, {
          name: groupName
        });
        return {
          data: {
            id,
            name: groupName
          },
          code: 0,
          msg: 'success'
        };
      });
      this.delete('/api/groups/:id', (schema, request) => {
        const id = request.params.id;
        schema.db.groups.remove(id);
        return {
          data: null,
          code: 0,
          msg: 'success'
        };
      });
    }
  });
}
