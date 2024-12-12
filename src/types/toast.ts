// File: types/toast.ts

export type ToastVariant = 'default' | 'destructive';

export interface ToastProps {
  title?: string;
  description: string;
  variant?: ToastVariant;
}

export type ToastActionElement = React.ReactElement;

export interface Toast extends ToastProps {
  id: string;
  action?: ToastActionElement;
}

export interface ToastContextValue {
  toast: (props: ToastProps) => void;
  dismiss: (toastId: string) => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}