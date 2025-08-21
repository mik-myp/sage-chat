/**
 * API 响应的基础类型
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

/**
 * 从 axios 库导入的类型
 */
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';

export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };

/**
 * 请求配置选项，扩展自 AxiosRequestConfig
 */
export interface RequestOptions extends Partial<AxiosRequestConfig> {
  /**
   * 是否显示加载状态
   */
  showLoading?: boolean;
  /**
   * 加载状态的提示文本
   */
  loadingText?: string;
  /**
   * 是否显示错误提示
   */
  showError?: boolean;
  /**
   * 是否处理成功提示
   */
  showSuccess?: boolean;
  /**
   * 成功提示文本
   */
  successText?: string;
}

/**
 * 流式请求的配置选项
 */
export interface StreamRequestOptions {
  /**
   * 是否显示加载状态
   */
  showLoading?: boolean;
  /**
   * 是否显示错误提示
   */
  showError?: boolean;
  /**
   * 请求超时时间（毫秒）
   */
  timeout?: number;
}
