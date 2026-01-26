'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateEnquiryStatus } from '@/modules/enquiries/enquiry.actions';
import { toast } from 'sonner';

interface EnquiryActionsProps {
  enquiryId: string;
  currentStatus: 'NEW' | 'CONTACTED' | 'CLOSED';
}

export function EnquiryActions({ enquiryId, currentStatus }: EnquiryActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await updateEnquiryStatus({
        enquiryId,
        status: newStatus as 'NEW' | 'CONTACTED' | 'CLOSED',
      });
      toast.success('Enquiry status updated');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="NEW">New</SelectItem>
        <SelectItem value="CONTACTED">Contacted</SelectItem>
        <SelectItem value="CLOSED">Closed</SelectItem>
      </SelectContent>
    </Select>
  );
}
