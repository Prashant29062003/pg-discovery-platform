/**
 * Operating Hours Tab Content Component
 */
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HoursSectionProps {
  checkInTime: string;
  checkOutTime: string;
  minStayDays: string | number;
  onUpdate: (key: string, value: string) => void;
}

export function HoursSection({
  checkInTime,
  checkOutTime,
  minStayDays,
  onUpdate,
}: HoursSectionProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Operating Hours</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">Check-in/out times and minimum stay</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Check-in and Check-out Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Check-in Time
            </label>
            <Input
              type="time"
              value={checkInTime}
              onChange={(e) => onUpdate('checkInTime', e.target.value)}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Default: 2:00 PM</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Check-out Time
            </label>
            <Input
              type="time"
              value={checkOutTime}
              onChange={(e) => onUpdate('checkOutTime', e.target.value)}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Default: 11:00 AM</p>
          </div>
        </div>

        {/* Minimum Stay */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            Minimum Stay (days)
          </label>
          <Input
            type="number"
            min="1"
            value={minStayDays}
            onChange={(e) => onUpdate('minStayDays', e.target.value)}
            placeholder="1"
            className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Minimum number of days for booking
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
