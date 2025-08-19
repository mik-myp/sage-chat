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

export const CHATS_BASE_URL = '/chats';

export const GROUPS_BASE_URL = '/groups';
