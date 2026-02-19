'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { createSafetyAudit } from '@/modules/safety/safety.actions';
import { AUDIT_CATEGORIES, type AuditStatus, type CreateSafetyAuditInput } from '@/modules/safety/safety.schema';
import { toast } from 'sonner';

interface AddSafetyAuditDialogProps {
  pgId: string;
  onSuccess?: () => void;
}

export function AddSafetyAuditDialog({ pgId, onSuccess }: AddSafetyAuditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    item: '',
    status: 'compliant',
    inspectedBy: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.item || !formData.status) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const auditData: CreateSafetyAuditInput = {
        pgId,
        category: formData.category as typeof AUDIT_CATEGORIES[number],
        item: formData.item,
        status: formData.status as AuditStatus,
        inspectedBy: formData.inspectedBy,
        notes: formData.notes,
      };

      await createSafetyAudit(auditData);

      toast.success('Safety audit added successfully');
      setOpen(false);
      setFormData({
        category: '',
        item: '',
        status: 'compliant',
        inspectedBy: '',
        notes: '',
      });
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add safety audit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Audit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Safety Audit</DialogTitle>
          <DialogDescription>Log a safety inspection for this property</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {AUDIT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Item/Description */}
          <div className="space-y-2">
            <Label htmlFor="item">Item/Description *</Label>
            <Input
              id="item"
              placeholder="e.g., Fire extinguisher installed"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compliant">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Compliant
                  </span>
                </SelectItem>
                <SelectItem value="warning">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Warning
                  </span>
                </SelectItem>
                <SelectItem value="critical">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Critical
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inspector Name */}
          <div className="space-y-2">
            <Label htmlFor="inspectedBy">Inspected By</Label>
            <Input
              id="inspectedBy"
              placeholder="Inspector name"
              value={formData.inspectedBy}
              onChange={(e) => setFormData({ ...formData, inspectedBy: e.target.value })}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add inspection details, issues found, recommendations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Adding...' : 'Add Audit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
