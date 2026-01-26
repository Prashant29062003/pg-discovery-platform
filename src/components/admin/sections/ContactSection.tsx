/**
 * Contact Information Tab Content Component
 */
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactSectionProps {
  managerName: string;
  phoneNumber: string;
  onUpdate: (key: string, value: string) => void;
}

export function ContactSection({
  managerName,
  phoneNumber,
  onUpdate,
}: ContactSectionProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Contact Information</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">Manager details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Manager Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            Manager Name
          </label>
          <Input
            value={managerName}
            onChange={(e) => onUpdate('managerName', e.target.value)}
            placeholder="e.g., John Doe"
            className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            Phone Number
          </label>
          <Input
            value={phoneNumber}
            onChange={(e) => onUpdate('phoneNumber', e.target.value)}
            placeholder="+91-9876543210"
            className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Format: +91-9876543210</p>
        </div>
      </CardContent>
    </Card>
  );
}
