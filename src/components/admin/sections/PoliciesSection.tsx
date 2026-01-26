/**
 * Policies Tab Content Component
 */
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PoliciesSectionProps {
  rulesAndRegulations: string;
  cancellationPolicy: string;
  onUpdate: (key: string, value: string) => void;
}

export function PoliciesSection({
  rulesAndRegulations,
  cancellationPolicy,
  onUpdate,
}: PoliciesSectionProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Rules & Policies</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">Property rules and cancellation policy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rules and Regulations */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            Rules & Regulations
          </label>
          <Textarea
            value={rulesAndRegulations}
            onChange={(e) => onUpdate('rulesAndRegulations', e.target.value)}
            placeholder="List property rules (e.g., No alcohol, Quiet hours, Visitors policy)"
            rows={4}
            className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
          />
        </div>

        {/* Cancellation Policy */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            Cancellation Policy
          </label>
          <Textarea
            value={cancellationPolicy}
            onChange={(e) => onUpdate('cancellationPolicy', e.target.value)}
            placeholder="Describe your cancellation policy (e.g., 30 days notice)"
            rows={4}
            className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
          />
        </div>
      </CardContent>
    </Card>
  );
}
