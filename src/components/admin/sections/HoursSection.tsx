/**
 * Operating Hours Tab Content Component
 */
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Info, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils';

interface HoursSectionProps {
  checkInTime: string;
  checkOutTime: string;
  minStayDays: string | number;
  onUpdate: (key: string, value: string) => void;
}

const COMMON_TIMES = [
  { label: 'Morning (9:00 AM)', value: '09:00' },
  { label: 'Noon (12:00 PM)', value: '12:00' },
  { label: 'Afternoon (2:00 PM)', value: '14:00' },
  { label: 'Evening (6:00 PM)', value: '18:00' },
  { label: 'Night (9:00 PM)', value: '21:00' },
];

const MIN_STAY_OPTIONS = [
  { label: '1 day', value: '1' },
  { label: '1 week', value: '7' },
  { label: '2 weeks', value: '14' },
  { label: '1 month', value: '30' },
  { label: '3 months', value: '90' },
];

export function HoursSection({
  checkInTime,
  checkOutTime,
  minStayDays,
  onUpdate,
}: HoursSectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function - called only when needed
  const validateTimes = () => {
    const newErrors: Record<string, string> = {};
    
    // Only validate if the field has been touched or has a value
    // Don't validate empty fields as errors initially
    
    // Validate check-in time only if it has a value
    if (checkInTime && checkInTime.trim() === '') {
      newErrors.checkInTime = 'Check-in time is required';
    }
    
    // Validate check-out time only if it has a value
    if (checkOutTime && checkOutTime.trim() === '') {
      newErrors.checkOutTime = 'Check-out time is required';
    }
    
    // Validate minimum stay only if it has a value
    const minStay = Number(minStayDays);
    if (minStayDays && (minStay < 1 || minStay > 365)) {
      if (minStay < 1) {
        newErrors.minStayDays = 'Minimum stay must be at least 1 day';
      } else if (minStay > 365) {
        newErrors.minStayDays = 'Minimum stay cannot exceed 365 days';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setToDefaults = () => {
    onUpdate('checkInTime', '14:00');
    onUpdate('checkOutTime', '11:00');
    onUpdate('minStayDays', '1');
    setErrors({});
  };

  // Validate only when values change and have actual content
  React.useEffect(() => {
    // Only validate if there are actual values to validate
    if (checkInTime || checkOutTime || minStayDays) {
      validateTimes();
    }
  }, [checkInTime, checkOutTime, minStayDays]);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Operating Hours & Stay Policy
          </CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Set check-in/check-out times and minimum stay requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default Settings Button */}
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Quick Setup</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Use standard hotel timings (2PM check-in, 11AM check-out)</p>
              </div>
            </div>
            <Button
              onClick={setToDefaults}
              variant="outline"
              size="sm"
              className="border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Set Defaults
            </Button>
          </div>

          {/* Validation Status */}
          {Object.keys(errors).length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">
                Please fix the errors below to continue
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Check-in and Check-out Times */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Check-in & Check-out Times</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            When guests can check in and check out of your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Check-in Time
                {checkInTime && !errors.checkInTime && (
                  <Badge className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Set
                  </Badge>
                )}
              </label>
              <Input
                type="time"
                value={checkInTime}
                onChange={(e) => {
                  onUpdate('checkInTime', e.target.value);
                  if (errors.checkInTime) {
                    setErrors(prev => ({ ...prev, checkInTime: '' }));
                  }
                }}
                className={cn(
                  "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700",
                  errors.checkInTime ? "border-red-500 dark:border-red-500" : 
                  checkInTime ? "border-green-300 dark:border-green-700" : ""
                )}
              />
              {errors.checkInTime && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.checkInTime}</p>
              )}
              {!errors.checkInTime && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  💡 Most PGs use 2:00 PM (14:00) for check-in
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Check-out Time
                {checkOutTime && !errors.checkOutTime && (
                  <Badge className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Set
                  </Badge>
                )}
              </label>
              <Input
                type="time"
                value={checkOutTime}
                onChange={(e) => {
                  onUpdate('checkOutTime', e.target.value);
                  if (errors.checkOutTime) {
                    setErrors(prev => ({ ...prev, checkOutTime: '' }));
                  }
                }}
                className={cn(
                  "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700",
                  errors.checkOutTime ? "border-red-500 dark:border-red-500" : 
                  checkOutTime ? "border-green-300 dark:border-green-700" : ""
                )}
              />
              {errors.checkOutTime && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.checkOutTime}</p>
              )}
              {!errors.checkOutTime && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  💡 Most PGs use 11:00 AM for check-out
                </p>
              )}
            </div>
          </div>

          {/* Quick Time Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
              Quick Selection
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {COMMON_TIMES.map((time) => (
                <Button
                  key={time.value}
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate('checkInTime', time.value)}
                  className="text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  {time.label.split(' ')[0]}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Logic Info */}
          {checkInTime && checkOutTime && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">Time Logic</p>
                  <p className="text-xs mt-1">
                    Check-out time is typically on the next day. For example: 2:00 PM check-in today, 11:00 AM check-out tomorrow.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Minimum Stay */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Minimum Stay Policy</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Set the minimum number of days guests must stay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Minimum Stay (days)
              {minStayDays && !errors.minStayDays && (
                <Badge className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Set
                </Badge>
              )}
            </label>
            <Input
              type="number"
              min="1"
              max="365"
              value={minStayDays}
              onChange={(e) => {
                onUpdate('minStayDays', e.target.value);
                if (errors.minStayDays) {
                  setErrors(prev => ({ ...prev, minStayDays: '' }));
                }
              }}
              placeholder="1"
              className={cn(
                "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700",
                errors.minStayDays ? "border-red-500 dark:border-red-500" : 
                minStayDays ? "border-green-300 dark:border-green-700" : ""
              )}
            />
            {errors.minStayDays && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.minStayDays}</p>
            )}
            {!errors.minStayDays && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Minimum: 1 day, Maximum: 365 days
              </p>
            )}
          </div>

          {/* Quick Stay Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
              Common Durations
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {MIN_STAY_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate('minStayDays', option.value)}
                  className="text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Stay Policy Info */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Why set minimum stay?</p>
                <p className="text-xs mt-1">
                  Helps ensure stable occupancy, reduces turnover costs, and attracts longer-term guests who provide consistent revenue.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
