import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className={cn('w-full', className)}>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-muted px-4 py-2 text-left text-sm font-medium hover:bg-muted/80 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
            <span>{title}</span>
            <ChevronUpIcon
              className={cn('h-5 w-5 text-muted-foreground transition-transform', {
                'rotate-180 transform': open,
              })}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted-foreground">
            {children}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
} 