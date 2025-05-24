import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

// Extend Jest's expect with DOM matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      not: {
        toBeInTheDocument(): R;
      };
    }
  }
}

// Extend expect with DOM matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
    };
  },
  toHaveClass(received, className) {
    const pass = received?.classList.contains(className);
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have class ${className}`,
    };
  },
}); 