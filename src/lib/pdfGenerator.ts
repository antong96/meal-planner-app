import { ShoppingItem } from './types';

interface PDFOptions {
  title?: string;
  date?: string;
  store?: string;
}

export async function generateShoppingListPDF(
  items: ShoppingItem[],
  options: PDFOptions = {}
): Promise<Blob> {
  const { title = 'Shopping List', date = new Date().toLocaleDateString(), store } = options;

  // Group items by category
  const categorizedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  // Create HTML content
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .date {
            color: #666;
            margin-bottom: 10px;
          }
          .category {
            margin-bottom: 20px;
          }
          .category-title {
            font-weight: bold;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .item-name {
            flex: 1;
          }
          .item-amount {
            color: #666;
          }
          .store {
            margin-top: 20px;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div class="date">${date}</div>
        </div>
        ${Object.entries(categorizedItems)
          .map(
            ([category, items]) => `
          <div class="category">
            <div class="category-title">${category}</div>
            ${items
              .map(
                (item) => `
              <div class="item">
                <span class="item-name">${item.name}</span>
                <span class="item-amount">${item.amount} ${item.unit}</span>
              </div>
            `
              )
              .join('')}
          </div>
        `
          )
          .join('')}
        ${store ? `<div class="store">Store: ${store}</div>` : ''}
      </body>
    </html>
  `;

  // Convert HTML to PDF using browser's print functionality
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Failed to open print window');
  }

  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for content to load
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Use browser's print to PDF functionality
  printWindow.print();
  printWindow.close();

  // Return a placeholder blob for now
  // TODO: Implement actual PDF generation
  return new Blob([html], { type: 'application/pdf' });
} 