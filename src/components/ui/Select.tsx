import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  disabled = false,
  className,
}: SelectProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button
          className={cn(
            'relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700',
            {
              'opacity-50 cursor-not-allowed': disabled,
            },
            className
          )}
        >
          <span className="block truncate">{selectedOption?.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-800">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  cn(
                    'relative cursor-default select-none py-2 pl-10 pr-4',
                    {
                      'bg-primary text-white': active,
                      'text-gray-900 dark:text-gray-100': !active,
                    }
                  )
                }
                value={option.value}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={cn('block truncate', {
                        'font-medium': selected,
                        'font-normal': !selected,
                      })}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span
                        className={cn(
                          'absolute inset-y-0 left-0 flex items-center pl-3',
                          {
                            'text-white': active,
                            'text-primary': !active,
                          }
                        )}
                      >
                        ✓
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
} 