/**
 * Policies Tab Content Component
 */
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, Clock, AlertCircle, CheckCircle2, RefreshCw, Plus, X } from 'lucide-react';
import { cn } from '@/utils';

interface PoliciesSectionProps {
  rulesAndRegulations: string;
  cancellationPolicy: string;
  onUpdate: (key: string, value: string) => void;
}

const COMMON_RULES = [
  { label: 'No alcohol or smoking', value: 'No alcohol or smoking allowed on premises' },
  { label: 'Quiet hours', value: 'Quiet hours from 10 PM to 6 AM' },
  { label: 'Visitors policy', value: 'Visitors allowed only with prior permission' },
  { label: 'No pets', value: 'No pets allowed in the property' },
  { label: 'Cleanliness', value: 'Keep common areas clean at all times' },
  { label: 'Security', value: 'All guests must provide ID proof' },
  { label: 'Food policy', value: 'No outside food allowed in rooms' },
  { label: 'Parking', value: 'Parking available at additional cost' },
];

const CANCELLATION_TEMPLATES = [
  { label: 'Flexible (7 days)', value: 'Free cancellation up to 7 days before check-in' },
  { label: 'Moderate (15 days)', value: '50% refund for cancellations 15-7 days before check-in' },
  { label: 'Strict (30 days)', value: 'No refund for cancellations within 30 days' },
  { label: 'Non-refundable', value: 'Non-refundable booking - no cancellation allowed' },
];

export function PoliciesSection({
  rulesAndRegulations,
  cancellationPolicy,
  onUpdate,
}: PoliciesSectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePolicies = () => {
    const newErrors: Record<string, string> = {};
    
    // Only validate if there's content
    if (rulesAndRegulations && rulesAndRegulations.trim().length > 0 && rulesAndRegulations.trim().length < 10) {
      newErrors.rulesAndRegulations = 'Rules must be at least 10 characters long';
    }
    
    if (cancellationPolicy && cancellationPolicy.trim().length > 0 && cancellationPolicy.trim().length < 10) {
      newErrors.cancellationPolicy = 'Policy must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useEffect(() => {
    if (rulesAndRegulations || cancellationPolicy) {
      validatePolicies();
    }
  }, [rulesAndRegulations, cancellationPolicy]);

  const addCommonRule = (rule: string) => {
    const currentRules = rulesAndRegulations ? rulesAndRegulations.split('\n').filter(r => r.trim()) : [];
    if (!currentRules.includes(rule)) {
      onUpdate('rulesAndRegulations', [...currentRules, rule].join('\n'));
    }
  };

  const removeRule = (ruleToRemove: string) => {
    const currentRules = rulesAndRegulations ? rulesAndRegulations.split('\n').filter(r => r.trim()) : [];
    const updatedRules = currentRules.filter(rule => rule !== ruleToRemove);
    onUpdate('rulesAndRegulations', updatedRules.join('\n'));
  };

  const setToDefaults = () => {
    onUpdate('rulesAndRegulations', 'No alcohol or smoking allowed on premises\nQuiet hours from 10 PM to 6 AM\nVisitors allowed only with prior permission\nKeep common areas clean at all times');
    onUpdate('cancellationPolicy', 'Free cancellation up to 7 days before check-in. 50% refund for cancellations 7-3 days before check-in. No refund within 3 days of check-in.');
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Property Policies & Guidelines
          </CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Set house rules and cancellation policies for guests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default Settings Button */}
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Quick Setup</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Use standard PG policies and cancellation terms</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={setToDefaults}
              variant="outline"
              size="sm"
              className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
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

      {/* Rules and Regulations */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">House Rules & Regulations</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Guidelines for guests staying at your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Common Rules */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
              Common PG Rules
              {rulesAndRegulations && !errors.rulesAndRegulations && (
                <Badge className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Set
                </Badge>
              )}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {COMMON_RULES.map((rule) => (
                <Button
                  key={rule.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCommonRule(rule.value)}
                  className="text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 justify-start"
                >
                  <Plus className="w-3 h-3 mr-2" />
                  {rule.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Rules */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Custom Rules
              <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                (One rule per line)
              </span>
            </label>
            <Textarea
              value={rulesAndRegulations}
              onChange={(e) => {
                onUpdate('rulesAndRegulations', e.target.value);
                if (errors.rulesAndRegulations) {
                  setErrors(prev => ({ ...prev, rulesAndRegulations: '' }));
                }
              }}
              placeholder="Add custom rules (one per line)&#10;e.g.,&#10;- No outside food allowed&#10;- No loud music after 10 PM&#10;- All guests must provide ID proof"
              rows={6}
              className={cn(
                "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700",
                errors.rulesAndRegulations ? "border-red-500 dark:border-red-500" : 
                rulesAndRegulations ? "border-green-300 dark:border-green-700" : ""
              )}
            />
            {errors.rulesAndRegulations && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.rulesAndRegulations}</p>
            )}
            {!errors.rulesAndRegulations && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                💡 Be specific and clear to avoid misunderstandings
              </p>
            )}
          </div>

          {/* Current Rules Display */}
          {rulesAndRegulations && (
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                Current Rules ({rulesAndRegulations.split('\n').filter(r => r.trim()).length})
              </label>
              <div className="space-y-2">
                {rulesAndRegulations.split('\n').filter(rule => rule.trim()).map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded border border-zinc-200 dark:border-zinc-700">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {rule.trim()}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRule(rule.trim())}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Cancellation Policy</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Refund and cancellation terms for bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Common Policies */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
              Common Policies
              {cancellationPolicy && !errors.cancellationPolicy && (
                <Badge className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Set
                </Badge>
              )}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CANCELLATION_TEMPLATES.map((policy) => (
                <Button
                  key={policy.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate('cancellationPolicy', policy.value)}
                  className="text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 justify-start"
                >
                  <Clock className="w-3 h-3 mr-2" />
                  {policy.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Policy */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Custom Policy
            </label>
            <Textarea
              value={cancellationPolicy}
              onChange={(e) => {
                onUpdate('cancellationPolicy', e.target.value);
                if (errors.cancellationPolicy) {
                  setErrors(prev => ({ ...prev, cancellationPolicy: '' }));
                }
              }}
              placeholder="Describe your cancellation policy in detail&#10;e.g.,&#10;- Free cancellation up to 7 days before check-in&#10;- 50% refund for cancellations 7-3 days before check-in&#10;- No refund within 3 days of check-in&#10;- Non-refundable bookings"
              rows={6}
              className={cn(
                "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700",
                errors.cancellationPolicy ? "border-red-500 dark:border-red-500" : 
                cancellationPolicy ? "border-green-300 dark:border-green-700" : ""
              )}
            />
            {errors.cancellationPolicy && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cancellationPolicy}</p>
            )}
            {!errors.cancellationPolicy && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                💡 Clear policies help manage guest expectations and reduce disputes
              </p>
            )}
          </div>

          {/* Policy Info */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Why clear policies matter?</p>
                <p className="text-xs mt-1">
                  Clear cancellation policies protect both you and guests. They set expectations upfront and help avoid disputes during booking cancellations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
