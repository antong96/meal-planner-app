import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface DynamicFormFieldsProps {
  name: string;
  label: string;
  type: 'ingredient' | 'instruction';
}

export function DynamicFormFields({ name, label, type }: DynamicFormFieldsProps) {
  const { control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const handleAdd = () => {
    if (type === 'ingredient') {
      append({ name: '', amount: 0, unit: '' });
    } else {
      append('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{label}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add {type === 'ingredient' ? 'Ingredient' : 'Step'}
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4">
            {type === 'ingredient' ? (
              <>
                <div className="flex-1">
                  <Input
                    label="Ingredient Name"
                    type="text"
                    error={errors[name]?.[index]?.name?.message}
                    {...control.register(`${name}.${index}.name`)}
                  />
                </div>
                <div className="w-32">
                  <Input
                    label="Amount"
                    type="number"
                    error={errors[name]?.[index]?.amount?.message}
                    {...control.register(`${name}.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="w-32">
                  <Input
                    label="Unit"
                    type="text"
                    error={errors[name]?.[index]?.unit?.message}
                    {...control.register(`${name}.${index}.unit`)}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1">
                <Input
                  label={`Step ${index + 1}`}
                  type="text"
                  error={errors[name]?.[index]?.message}
                  {...control.register(`${name}.${index}`)}
                />
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-end"
              onClick={() => remove(index)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 