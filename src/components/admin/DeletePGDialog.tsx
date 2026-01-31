'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from '@/utils';

interface DeletePGDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pg: {
    id: string;
    name: string;
    description: string;
    city: string;
    locality: string;
  };
  onConfirm: () => Promise<void>;
}

export function DeletePGDialog({ open, onOpenChange, pg, onConfirm }: DeletePGDialogProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const expectedText = pg.name;
  const canDelete = confirmationText === expectedText;

  const handleConfirm = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    setError('');

    try {
      await onConfirm();
      onOpenChange(false);
      setConfirmationText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete PG');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onOpenChange(false);
      setConfirmationText('');
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete PG Property
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the PG property
            and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Alert */}
          <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Warning:</strong> Deleting this PG will also remove all associated rooms,
              bookings, and data. This action is irreversible.
            </AlertDescription>
          </Alert>

          {/* PG Details */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-sm">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {pg.name}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {pg.locality}, {pg.city}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                {pg.description}
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <label htmlFor="confirmation" className="text-sm font-medium">
              To confirm deletion, type <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{expectedText}</span> below:
            </label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={expectedText}
              className={cn(
                canDelete
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                  : "border-gray-300 focus:border-gray-300"
              )}
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canDelete || isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete PG
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
