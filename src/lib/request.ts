import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { toast } from 'sonner';
import type { StreamRequestOptions } from './types';
import type { AxiosInstance } from 'axios';

// 扩展Window接口，添加请求队列类型
declare global {
  interface Window {
    _pendingRequests?: Record<string, boolean>;
  }
}

// 定义泛型的axios实例类型
export interface ApiInstance extends AxiosInstance {
  <T = unknown>(config: InternalAxiosRequestConfig): Promise<T>;
  <T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
}

// 创建 axios 实例
const request: ApiInstance = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeoutErrorMessage: '请求超时'
}) as ApiInstance;

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 检查是否有token并添加到请求头
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers = config.headers || {};
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }

    // 使用请求队列处理
    const skipQueue = config.skipQueue;
    // 生成唯一请求键并保存到config中，以便在响应处理中复用
    const requestKey = `${config.method?.toUpperCase()}:${config.url}${config.data ? `:${JSON.stringify(config.data)}` : ''}${config.params ? `:${JSON.stringify(config.params)}` : ''}`;
    // 保存requestKey到config，以便在响应拦截器中使用
    config.requestKey = requestKey;

    // 如果当前请求已在队列中且不跳过队列，则不重复请求
    if (
      !skipQueue &&
      window._pendingRequests &&
      window._pendingRequests[requestKey]
    ) {
      // 取消当前请求
      const controller = new AbortController();
      config.signal = controller.signal;
      controller.abort();

      // 返回一个永远不会resolve的Promise，防止后续处理
      return new Promise<never>(() => {});
    }

    // 如果不跳过队列，则将请求添加到队列
    if (!skipQueue) {
      if (!window._pendingRequests) {
        window._pendingRequests = {};
      }
      window._pendingRequests[requestKey] = true;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 在响应拦截器中清理请求队列
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 清理请求队列
    const config = response.config;
    if (!config.skipQueue) {
      // 直接使用请求拦截器中保存的requestKey
      const requestKey = config.requestKey;
      if (requestKey && window._pendingRequests) {
        delete window._pendingRequests[requestKey];
      }
    }

    const { data, code, msg } = response.data;
    if (code === 50001) {
      // token过期，重定向登录页面
      toast.error('登录过期，请重新登录');
      location.href = '/login';
    } else if (code !== 0) {
      // 报错提示
      toast.error(msg);
      return Promise.reject(data);
    }
    return data;
  },
  (error: AxiosError) => {
    // 处理错误响应时也要清理请求队列
    if (error.config && !error.config.skipQueue) {
      // 直接使用请求拦截器中保存的requestKey
      const requestKey = error.config.requestKey;
      if (requestKey && window._pendingRequests) {
        delete window._pendingRequests[requestKey];
      }
    }

    let errorMessage = '请求失败';
    if (
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data
    ) {
      errorMessage = String(error.response.data.message);
    } else if (error.message) {
      errorMessage = error.message;
    }

    // 使用 sonner toast 显示错误信息
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

/**
 * 处理流式请求的函数
 * @param url 请求地址
 * @param data 请求数据
 * @param onMessage 接收消息的回调函数
 * @param onComplete 完成的回调函数
 * @param onError 错误的回调函数
 * @param options 流式请求配置选项
 * @returns AbortController 实例，可用于取消请求
 */
export const streamRequest = async <T>(
  url: string,
  data: Record<string, unknown>,
  onMessage: (data: T) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void,
  options?: StreamRequestOptions
): Promise<AbortController> => {
  const controller = new AbortController();
  const signal = controller.signal;
  const { showLoading = false, showError = true, timeout } = options || {};

  let loadingToastId: string | number | undefined;
  if (showLoading) {
    loadingToastId = toast.loading('请求中...', { duration: Infinity });
  }

  // 设置超时
  let timeoutId: NodeJS.Timeout | undefined;
  if (timeout) {
    timeoutId = setTimeout(() => {
      controller.abort();
      const error = new Error('请求超时');
      if (showError) {
        toast.error('请求超时');
      }
      onError?.(error);
    }, timeout);
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || '/api'}${url}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(data),
        signal
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应体的读取器');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onComplete?.();
        break;
      }

      try {
        const chunk = decoder.decode(value, { stream: true });
        // 处理可能的分块数据，例如 SSE 格式
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            try {
              // 检查是否是 SSE 格式 (data: ...)
              if (line.startsWith('data:')) {
                const jsonData = JSON.parse(line.substring(5).trim());
                onMessage(jsonData);
              } else {
                // 尝试直接解析 JSON
                const jsonData = JSON.parse(line);
                onMessage(jsonData);
              }
            } catch (error: unknown) {
              console.log('🌍 ~ streamRequest ~ error:', error);
              // 非 JSON 格式的数据流处理
              onMessage(line.trim() as unknown as T);
            }
          }
        }
      } catch (error) {
        onError?.(error as Error);
      }
    }
  } catch (error) {
    if (loadingToastId) {
      toast.dismiss(loadingToastId);
    }

    if (error instanceof Error && error.name === 'AbortError') {
      // 请求被中止，通常不需要显示错误
      return controller;
    }

    const errorMessage = (error as Error).message || '流式请求失败';
    if (showError) {
      toast.error(errorMessage);
    }
    onError?.(error as Error);
  } finally {
    // 清除超时
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 清除加载状态
    if (loadingToastId) {
      toast.dismiss(loadingToastId);
    }
  }

  return controller;
};

// 扩展InternalAxiosRequestConfig接口，添加skipQueue和requestKey选项
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    skipQueue?: boolean;
    requestKey?: string;
  }
}

/**
 * 清除指定请求
 * @param config 请求配置
 */
export const clearPendingRequest = (
  config: Partial<InternalAxiosRequestConfig>
): void => {
  if (window._pendingRequests) {
    const requestKey = `${config.method?.toUpperCase()}:${config.url}${config.data ? `:${JSON.stringify(config.data)}` : ''}${config.params ? `:${JSON.stringify(config.params)}` : ''}`;
    delete window._pendingRequests[requestKey];
  }
};

/**
 * 清除所有请求
 */
export const clearAllPendingRequests = (): void => {
  if (window._pendingRequests) {
    window._pendingRequests = {};
  }
};

// 移除RequestQueueManager类，因为我们不再使用它

// 移除不需要的代码

export default request;
