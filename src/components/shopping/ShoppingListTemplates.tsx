import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItem } from '@/lib/types';
import { PlusIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ShoppingListTemplate {
  id: string;
  name: string;
  items: ShoppingItem[];
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  lastUsed?: Date;
}

interface ShoppingListTemplatesProps {
  onApplyTemplate: (items: ShoppingItem[]) => void;
}

export function ShoppingListTemplates({ onApplyTemplate }: ShoppingListTemplatesProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<ShoppingListTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ShoppingListTemplate | null>(null);

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a template name.',
        variant: 'destructive',
      });
      return;
    }

    const newTemplate: ShoppingListTemplate = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      items: [],
      frequency: 'weekly',
    };

    setTemplates([...templates, newTemplate]);
    setNewTemplateName('');
    setSelectedTemplate(newTemplate);

    toast({
      title: 'Success',
      description: 'Template created successfully.',
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }

    toast({
      title: 'Success',
      description: 'Template deleted successfully.',
    });
  };

  const handleApplyTemplate = (template: ShoppingListTemplate) => {
    onApplyTemplate(template.items);
    setTemplates(templates.map(t => 
      t.id === template.id 
        ? { ...t, lastUsed: new Date() }
        : t
    ));

    toast({
      title: 'Success',
      description: 'Template applied successfully.',
    });
  };

  const handleAddItem = (templateId: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: '',
      amount: 1,
      unit: 'piece',
      category: '',
    };

    setTemplates(templates.map(template =>
      template.id === templateId
        ? { ...template, items: [...template.items, newItem] }
        : template
    ));
  };

  const handleUpdateItem = (templateId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    setTemplates(templates.map(template =>
      template.id === templateId
        ? {
            ...template,
            items: template.items.map(item =>
              item.id === itemId
                ? { ...item, ...updates }
                : item
            ),
          }
        : template
    ));
  };

  const handleRemoveItem = (templateId: string, itemId: string) => {
    setTemplates(templates.map(template =>
      template.id === templateId
        ? {
            ...template,
            items: template.items.filter(item => item.id !== itemId),
          }
        : template
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shopping List Templates</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="New template name..."
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="w-48"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateTemplate}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <PlusIcon className="h-4 w-4 mr-2" />
              )}
              Create Template
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Templates</h3>
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg cursor-pointer ${
                    selectedTemplate?.id === template.id
                      ? 'bg-primary/10'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-gray-500">
                        {template.items.length} items • {template.frequency}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyTemplate(template);
                        }}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedTemplate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Template Items</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem(selectedTemplate.id)}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-2">
                  {selectedTemplate.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded"
                    >
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          handleUpdateItem(selectedTemplate.id, item.id, {
                            name: e.target.value,
                          })
                        }
                        placeholder="Item name"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          handleUpdateItem(selectedTemplate.id, item.id, {
                            amount: parseFloat(e.target.value),
                          })
                        }
                        className="w-20"
                      />
                      <Input
                        value={item.unit}
                        onChange={(e) =>
                          handleUpdateItem(selectedTemplate.id, item.id, {
                            unit: e.target.value,
                          })
                        }
                        placeholder="Unit"
                        className="w-24"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveItem(selectedTemplate.id, item.id)
                        }
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm">Frequency:</label>
                  <select
                    value={selectedTemplate.frequency}
                    onChange={(e) =>
                      setTemplates(
                        templates.map((t) =>
                          t.id === selectedTemplate.id
                            ? { ...t, frequency: e.target.value as any }
                            : t
                        )
                      )
                    }
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {templates.length === 0 && (
            <p className="text-center text-gray-500">No templates created yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 