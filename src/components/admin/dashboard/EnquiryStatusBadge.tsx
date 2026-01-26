'use client';

import { Badge } from '@/components/ui/badge';

interface EnquiryStatusBadgeProps {
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
}

export function EnquiryStatusBadge({ status }: EnquiryStatusBadgeProps) {
  const variants = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    CLOSED: 'bg-green-100 text-green-800',
  };

  const labels = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    CLOSED: 'Closed',
  };

  return (
    <Badge className={variants[status]}>
      {labels[status]}
    </Badge>
  );
}
