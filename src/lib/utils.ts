import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//
export function formatPhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
}

export function getSystemLanguage(): string {
  const language = navigator.language || 'zh';
  return language.split('-')[0]; // Return the language code (e.g., 'en', 'zh')
}

export function getUUID(): string {
  // 定义字符集：数字、小写字母、大写字母
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let uuid = '';

  // 生成16位随机字符串
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    uuid += chars[randomIndex];
  }

  // 确保至少包含一个数字、一个小写字母和一个大写字母
  const hasNumber = /\d/.test(uuid);
  const hasLowercase = /[a-z]/.test(uuid);
  const hasUppercase = /[A-Z]/.test(uuid);

  if (!(hasNumber && hasLowercase && hasUppercase)) {
    // 如果不满足条件，递归调用自身重新生成
    return getUUID();
  }

  return uuid;
}

export const CHATS_BASE_URL = '/chats';

export const GROUPS_BASE_URL = '/groups';
