/**
 * Status & Visibility Tab Content Component
 */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusSectionProps {
  isPublished: boolean;
  isFeatured: boolean;
  onUpdate: (key: string, value: boolean) => void;
}

export function StatusSection({ isPublished, isFeatured, onUpdate }: StatusSectionProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Status & Visibility</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">Publishing and feature settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Published Checkbox */}
          <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-md cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => onUpdate('isPublished', e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Published</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Make property visible to users</p>
            </div>
          </label>

          {/* Featured Checkbox */}
          <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-md cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => onUpdate('isFeatured', e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Featured</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Highlight on home page and search results
              </p>
            </div>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
