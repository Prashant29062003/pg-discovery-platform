'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Loader2 } from 'lucide-react';
import { updateSafetyAuditStatus } from '@/modules/safety/safety.actions';
import { AUDIT_STATUSES, type AuditStatus, type UpdateAuditStatusInput } from '@/modules/safety/safety.schema';
import { toast } from 'sonner';

interface UpdateSafetyAuditDialogProps {
  audit: {
    id: string;
    pgId: string;
    item: string;
    category: string;
    status: AuditStatus;
    notes?: string;
    lastChecked: string;
  };
  onSuccess?: () => void;
}

export function UpdateSafetyAuditDialog({ audit, onSuccess }: UpdateSafetyAuditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: audit.status,
    notes: audit.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const updateData: UpdateAuditStatusInput = {
        auditId: audit.id,
        pgId: audit.pgId,
        status: formData.status as AuditStatus,
        notes: formData.notes,
      };

      await updateSafetyAuditStatus(updateData);

      toast.success('Safety audit updated successfully');
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update safety audit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="w-4 h-4" />
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Safety Audit</DialogTitle>
          <DialogDescription>
            Update status and notes for: <strong>{audit.item}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category (Read-only) */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={audit.category} disabled className="bg-zinc-100 dark:bg-zinc-800" />
          </div>

          {/* Item (Read-only) */}
          <div className="space-y-2">
            <Label>Item</Label>
            <Input value={audit.item} disabled className="bg-zinc-100 dark:bg-zinc-800" />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as AuditStatus })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUDIT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        status === 'compliant' ? 'bg-green-500' :
                        status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add update notes, observations, or follow-up actions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Updating...' : 'Update Audit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
