'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteSafetyAudit } from '@/modules/safety/safety.actions';
import { type DeleteSafetyAuditInput } from '@/modules/safety/safety.schema';
import { toast } from 'sonner';

interface DeleteSafetyAuditDialogProps {
  audit: {
    id: string;
    pgId: string;
    item: string;
    category: string;
    status: string;
  };
  onSuccess?: () => void;
}

export function DeleteSafetyAuditDialog({ audit, onSuccess }: DeleteSafetyAuditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const deleteData: DeleteSafetyAuditInput = {
        auditId: audit.id,
        pgId: audit.pgId,
      };

      await deleteSafetyAudit(deleteData);

      toast.success('Safety audit deleted successfully');
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete safety audit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Safety Audit</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this safety audit record?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/20">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{audit.item}</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Category: {audit.category}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Status: {audit.status}</p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {loading ? 'Deleting...' : 'Delete Audit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
