import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastProvider';
import { animations } from '@/lib/toastTemplates';
import { ToastAction } from '@/lib/types';
import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';

// Test component that uses the toast system
function TestComponent() {
  const { toast, toastTemplate, dismiss, clearToasts } = useToast();

  const showBasicToast = () => {
    toast({
      title: 'Basic Toast',
      description: 'This is a basic toast message',
      duration: 3000,
    });
  };

  const showSuccessToast = () => {
    toastTemplate('success', {
      title: 'Success Toast',
      description: 'Operation completed successfully',
    });
  };

  const showErrorToast = () => {
    toastTemplate('error', {
      title: 'Error Toast',
      description: 'Something went wrong',
    });
  };

  const showToastWithActions = () => {
    const action: ToastAction = {
      label: 'View Details',
      onClick: () => console.log('Action clicked'),
      variant: 'primary',
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure?',
      analytics: {
        category: 'test',
        action: 'view_details',
        label: 'test_toast',
      },
    };

    toast({
      title: 'Action Toast',
      description: 'This toast has actions',
      actions: [action],
      duration: 5000,
      animation: animations.bounceIn,
    });
  };

  return (
    <div>
      <button onClick={showBasicToast}>Show Basic Toast</button>
      <button onClick={showSuccessToast}>Show Success Toast</button>
      <button onClick={showErrorToast}>Show Error Toast</button>
      <button onClick={showToastWithActions}>Show Toast with Actions</button>
      <button onClick={() => clearToasts()}>Clear All Toasts</button>
    </div>
  );
}

describe('Toast System', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders basic toast correctly', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Basic Toast'));
    expect(screen.getByText('Basic Toast')).toBeInTheDocument();
    expect(screen.getByText('This is a basic toast message')).toBeInTheDocument();
  });

  it('renders success toast template correctly', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success Toast'));
    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
  });

  it('renders error toast template correctly', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Error Toast'));
    expect(screen.getByText('Error Toast')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('handles toast with actions correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast with Actions'));
    expect(screen.getByText('Action Toast')).toBeInTheDocument();
    expect(screen.getByText('This toast has actions')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();

    // Test action click
    fireEvent.click(screen.getByText('View Details'));
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    
    // Test confirmation
    fireEvent.click(screen.getByText('Confirm'));
    expect(consoleSpy).toHaveBeenCalledWith('Action clicked');
  });

  it('auto-dismisses toast after duration', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Basic Toast'));
    expect(screen.getByText('Basic Toast')).toBeInTheDocument();

    // Advance timers by the toast duration
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // Advance timers by the exit animation duration (fadeIn is default)
    act(() => {
      jest.advanceTimersByTime(200); // animations.fadeIn.duration
    });

    expect(screen.queryByText('Basic Toast')).not.toBeInTheDocument();
  });

  it('clears all toasts when clearToasts is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Basic Toast'));
    fireEvent.click(screen.getByText('Show Success Toast'));
    expect(screen.getByText('Basic Toast')).toBeInTheDocument();
    expect(screen.getByText('Success Toast')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Clear All Toasts'));
    expect(screen.queryByText('Basic Toast')).not.toBeInTheDocument();
    expect(screen.queryByText('Success Toast')).not.toBeInTheDocument();
  });

  it('handles toast animations correctly', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast with Actions'));
    // Find the toast container by traversing up from the text node to the toast root
    const toastText = screen.getByText('Action Toast');
    let toastElement = toastText.parentElement;
    while (toastElement && !toastElement.className.includes('rounded-md')) {
      toastElement = toastElement.parentElement;
    }
    expect(toastElement).toHaveClass(animations.bounceIn.enter);
  });

  it('handles toast persistence correctly', () => {
    render(
      <ToastProvider persistToasts={true}>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Basic Toast'));
    expect(screen.getByText('Basic Toast')).toBeInTheDocument();

    // Simulate page reload
    render(
      <ToastProvider persistToasts={true}>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByText('Basic Toast')).toBeInTheDocument();
  });
}); 