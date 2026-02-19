'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface SafetyAuditDetailsDialogProps {
  audit: {
    id: string;
    pgId: string;
    item: string;
    category: string;
    status: 'compliant' | 'warning' | 'critical';
    notes?: string;
    lastChecked: string;
  };
}

export function SafetyAuditDetailsDialog({ audit }: SafetyAuditDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Eye className="w-4 h-4" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Safety Audit Details</DialogTitle>
          <DialogDescription>
            Complete information about this safety audit record
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/20">
            <div className="flex items-center gap-3">
              {getStatusIcon(audit.status)}
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{audit.category}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(audit.status)}`}>
              {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
            </span>
          </div>

          {/* Audit Item */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Audit Item</h4>
            </div>
            <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50">
              <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">{audit.item}</p>
            </div>
          </div>

          {/* Notes Section */}
          {audit.notes && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Inspection Notes</h4>
              </div>
              <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {audit.notes}
                </p>
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audit Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Audit Information</h4>
              </div>
              <div className="space-y-3 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Audit ID</span>
                  <span className="text-sm font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-700 dark:text-zinc-300">
                    {audit.id.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Property ID</span>
                  <span className="text-sm font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-700 dark:text-zinc-300">
                    {audit.pgId.slice(-6)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Timing Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Timing</h4>
              </div>
              <div className="space-y-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Date</span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {new Date(audit.lastChecked).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Time</span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {new Date(audit.lastChecked).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <Button 
              onClick={() => setOpen(false)} 
              className="w-full"
              size="lg"
            >
              Close Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
