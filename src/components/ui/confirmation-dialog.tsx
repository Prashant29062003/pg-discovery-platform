'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils';
import { AlertTriangle, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'default';
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmationDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <Trash2 className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700';
      case 'warning':
        return 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600 hover:border-orange-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <Card className={cn(
        "relative z-50 max-w-md w-full p-6 shadow-2xl border-2",
        variant === 'destructive' && "border-red-200 dark:border-red-800",
        variant === 'warning' && "border-orange-200 dark:border-orange-800",
        variant === 'default' && "border-blue-200 dark:border-blue-800"
      )}>
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 bg-gray-50 dark:bg-gray-800">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            disabled={isLoading}
            className={cn("flex-1", getConfirmButtonClass())}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Hook for managing confirmation dialog state
export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<ConfirmationDialogProps, 'isOpen' | 'onClose' | 'isLoading'>>({
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
    variant: 'default',
    onConfirm: () => {}
  });

  const openDialog = (newConfig: Partial<Omit<ConfirmationDialogProps, 'isOpen' | 'onClose' | 'isLoading'>>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const confirm = () => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    closeDialog();
  };

  return {
    isOpen,
    openDialog,
    closeDialog,
    confirm,
    config: { ...config, isOpen, onClose: closeDialog, onConfirm: confirm }
  };
}
