import { Tab } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface TabsProps {
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

export function Tabs({ tabs, className }: TabsProps) {
  return (
    <Tab.Group>
      <Tab.List className={cn('flex space-x-1 rounded-xl bg-muted p-1', className)}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }) =>
              cn(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
                selected
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:bg-background/[0.12] hover:text-foreground'
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((tab, index) => (
          <Tab.Panel
            key={index}
            className={cn(
              'rounded-xl bg-background p-3',
              'ring-white/60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2'
            )}
          >
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
} 