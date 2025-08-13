import type { FunctionComponent } from 'react';
import { cn } from '@/lib/utils';

interface CellProps {
  title: string;
  subTitle?: string;
  description?: string | React.ReactNode;
  isLast?: boolean;
}

const Cell: FunctionComponent<CellProps> = (props) => {
  const { title, subTitle, description, isLast } = props;

  return (
    <div
      className={cn(
        'py-3 border-b border-solid border-gray-100 flex justify-between items-center gap-3',
        isLast && 'border-none'
      )}
    >
      {subTitle ? (
        <div className='flex flex-col'>
          <div className='flex flex-col flex-[1 0 0] justify-center items-start gap-1 pr-12'>
            <span className='text-sm'>{title}</span>
            <div className='text-xs text-gray-400'>{subTitle}</div>
          </div>
        </div>
      ) : (
        <span className='text-sm'>{title}</span>
      )}
      {typeof description === 'string' ? (
        <div className='text-sm flex items-center min-h-[2.125rem]'>
          {description}
        </div>
      ) : (
        description
      )}
    </div>
  );
};

export default Cell;
