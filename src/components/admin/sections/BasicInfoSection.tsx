/**
 * Basic Information Tab Content Component
 */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoSectionProps {
  name: string;
  description: string;
  gender: string;
  errors: Record<string, string>;
  onUpdate: (key: string, value: any) => void;
}

export function BasicInfoSection({
  name,
  description,
  gender,
  errors,
  onUpdate,
}: BasicInfoSectionProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Basic Information</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">Essential property details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            Property Name *
          </label>
          <Input
            value={name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="e.g., Elite PG Bangalore"
            className={`bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 ${
              errors.name ? 'border-red-500 dark:border-red-500' : ''
            }`}
          />
          {errors.name && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            Description *
          </label>
          <Textarea
            value={description}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder="Detailed description of your property..."
            rows={4}
            className={`bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 ${
              errors.description ? 'border-red-500 dark:border-red-500' : ''
            }`}
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {description?.length || 0}/1000 characters
          </p>
          {errors.description && (
            <p className="text-red-500 dark:text-red-400 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Gender Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Gender Type *
            </label>
            <select
              value={gender}
              onChange={(e) => onUpdate('gender', e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="MALE">Male Only</option>
              <option value="FEMALE">Female Only</option>
              <option value="UNISEX">Co-ed</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )};
