import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  AlertTriangleIcon
} from 'lucide-react';

interface ResultProps {
  /**
   * Result status, decides icons and colors
   * @default "info"
   */
  status?: 'success' | 'error' | 'info' | 'warning' | 404 | 403 | 500;
  /**
   * The title
   */
  title?: React.ReactNode;
  /**
   * The subTitle
   */
  subTitle?: React.ReactNode;
  /**
   * Custom back icon
   */
  icon?: React.ReactNode;
  /**
   * Operating area
   */
  extra?: React.ReactNode;
  /**
   * Additional class name
   */
  className?: string;
  /**
   * Additional styles
   */
  style?: React.CSSProperties;
}

const statusIcons = {
  success: <CheckCircleIcon className='size-full text-green-500' />,
  error: <XCircleIcon className='size-full text-red-500' />,
  info: <InfoIcon className='size-full text-blue-500' />,
  warning: <AlertTriangleIcon className='size-full text-yellow-500' />,
  404: <XCircleIcon className='size-full text-red-500' />,
  403: <XCircleIcon className='size-full text-red-500' />,
  500: <XCircleIcon className='size-full text-red-500' />
};

const statusTitles = {
  success: 'Success',
  error: 'Error',
  info: 'Info',
  warning: 'Warning',
  404: 'Not Found',
  403: 'Forbidden',
  500: 'Internal Server Error'
};

function Result({
  status = 'info',
  title,
  subTitle,
  icon,
  extra,
  className,
  style
}: ResultProps) {
  const iconNode = icon || statusIcons[status];
  const titleNode = title || statusTitles[status];

  return (
    <div
      data-slot='result'
      className={cn(
        'flex flex-col items-center justify-center p-6 text-center sm:p-8 h-full',
        className
      )}
      style={style}
    >
      {/* Icon */}
      <div className='mb-6'>
        <div className='size-16 sm:size-20 flex items-center justify-center'>
          {iconNode}
        </div>
      </div>

      {/* Title */}
      {titleNode && (
        <div className='mb-2 text-xl font-semibold sm:text-2xl'>
          {titleNode}
        </div>
      )}

      {/* Subtitle */}
      {subTitle && (
        <div className='mb-6 text-muted-foreground text-sm sm:text-base'>
          {subTitle}
        </div>
      )}

      {/* Extra content */}
      {extra && (
        <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4'>
          {extra}
        </div>
      )}
    </div>
  );
}

export { Result, type ResultProps };
