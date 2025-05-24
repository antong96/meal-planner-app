import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button as={Fragment}>{children}</Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className={cn(
                'absolute z-50 px-3 py-2 text-sm bg-popover text-popover-foreground rounded-md shadow-md',
                {
                  'bottom-full mb-2': side === 'top',
                  'left-full ml-2': side === 'right',
                  'top-full mt-2': side === 'bottom',
                  'right-full mr-2': side === 'left',
                },
                className
              )}
            >
              {content}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
} 