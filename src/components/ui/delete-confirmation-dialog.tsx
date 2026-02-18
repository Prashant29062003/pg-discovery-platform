'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils';
import { AlertTriangle, Trash2, AlertCircle, CheckCircle, Shield } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  mode?: 'strict' | 'simple'; // strict = type confirmation, simple = just click delete
  description?: string; // Custom description text
  showWarningIcon?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'item',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
  mode = 'strict',
  description,
  showWarningIcon = true,
}: DeleteConfirmationDialogProps) {
  const [confirmationText, setConfirmationText] = React.useState('');
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setConfirmationText('');
      setIsConfirmed(false);
    }
  }, [isOpen]);

  // Check if typed text matches exactly
  React.useEffect(() => {
    const matches = confirmationText.trim() === itemName.trim();
    setIsConfirmed(matches);
  }, [confirmationText, itemName]);

  const handleConfirm = () => {
    if (mode === 'simple' || isConfirmed) {
      onConfirm();
    }
  };

  const getIcon = () => {
    if (!showWarningIcon) return null;
    return <Trash2 className="w-6 h-6 text-red-500" />;
  };

  const isSimpleMode = mode === 'simple';
  const canConfirm = isSimpleMode || isConfirmed;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <Card className="relative z-50 max-w-lg w-full p-6 shadow-2xl border-2 border-red-200 dark:border-red-800">
        {/* Icon */}
        {getIcon() && (
          <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 bg-red-50 dark:bg-red-900/20">
            {getIcon()}
          </div>
        )}

        {/* Content */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Delete {itemType}?
          </h3>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {description || (
                <>
                  This action <span className="font-semibold text-red-600 dark:text-red-400">cannot be undone</span> and will permanently delete:
                </>
              )}
            </p>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="font-mono text-sm font-semibold text-red-700 dark:text-red-300">
                {itemName}
              </p>
            </div>
            
            {isSimpleMode ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this {itemType}?
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To confirm deletion, please type the {itemType} name exactly as shown above:
              </p>
            )}
          </div>

          {/* Confirmation Input - Only for strict mode */}
          {!isSimpleMode && (
            <div className="space-y-2">
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={`Type "${itemName}" to confirm`}
                className="w-full text-center font-mono"
                disabled={isLoading}
              />
              
              {/* Validation Feedback */}
              {confirmationText && (
                <div className="flex items-center justify-center gap-2 text-xs">
                  {isConfirmed ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Names match - you can proceed</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">Names do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Warning Badge */}
          {showWarningIcon && (
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                This is a destructive action
              </span>
            </div>
          )}
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Hook for managing delete confirmation dialog state
export function useDeleteConfirmationDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<DeleteConfirmationDialogProps, 'isOpen' | 'onClose' | 'isLoading'>>({
    itemName: '',
    itemType: 'item',
    onConfirm: () => {},
    mode: 'strict'
  });

  const openDialog = (newConfig: Partial<Omit<DeleteConfirmationDialogProps, 'isOpen' | 'onClose' | 'isLoading'>>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openDialog,
    closeDialog,
    config: { ...config, isOpen, onClose: closeDialog }
  };
}
