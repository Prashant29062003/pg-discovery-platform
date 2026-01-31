/**
 * Contact Information Tab Content Component
 */
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, User, CheckCircle2, AlertCircle, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/utils';

interface ContactSectionProps {
  managerName: string;
  phoneNumber: string;
  onUpdate: (key: string, value: string) => void;
}

const PHONE_FORMATS = [
  { label: '+91', value: '+91-', placeholder: '9876543210' },
  { label: '+1', value: '+1-', placeholder: '555-0123' },
  { label: '+44', value: '+44-', placeholder: '20-7123-4567' },
  { label: '+971', value: '+971-', placeholder: '50-123-4567' },
];

export function ContactSection({
  managerName,
  phoneNumber,
  onUpdate,
}: ContactSectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateContact = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate manager name only if it has a value
    if (managerName && managerName.trim().length > 0 && managerName.trim().length < 2) {
      newErrors.managerName = 'Name must be at least 2 characters long';
    }
    
    // Validate phone number only if it has a value
    if (phoneNumber && phoneNumber.trim().length > 0) {
      const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(phoneNumber.trim())) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useEffect(() => {
    if (managerName || phoneNumber) {
      validateContact();
    }
  }, [managerName, phoneNumber]);

  const setToDefaults = () => {
    onUpdate('managerName', 'Property Manager');
    onUpdate('phoneNumber', '+91-9876543210');
    setErrors({});
  };

  const formatPhoneNumber = (number: string) => {
    // Remove all non-digit characters
    const digits = number.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length === 10) {
      return `+91-${digits}`;
    } else if (digits.length === 11 && digits.startsWith('91')) {
      return `+91-${digits.substring(2)}`;
    } else if (digits.startsWith('+')) {
      return number;
    }
    
    return number;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const openPhoneDialer = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Manager details and contact information for guests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default Settings Button */}
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <User className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Quick Setup</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Use standard contact information format</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={setToDefaults}
              variant="outline"
              size="sm"
              className="border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950"
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

      {/* Manager Information */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Manager Details</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Information about the property manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Manager Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Manager Name
              {managerName && !errors.managerName && (
                <Badge className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Set
                </Badge>
              )}
            </label>
            <Input
              value={managerName}
              onChange={(e) => {
                onUpdate('managerName', e.target.value);
                if (errors.managerName) {
                  setErrors(prev => ({ ...prev, managerName: '' }));
                }
              }}
              placeholder="e.g., John Doe, Property Manager"
              className={cn(
                "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700",
                errors.managerName ? "border-red-500 dark:border-red-500" : 
                managerName ? "border-green-300 dark:border-green-700" : ""
              )}
            />
            {errors.managerName && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.managerName}</p>
            )}
            {!errors.managerName && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                💡 This name will be visible to guests for contact purposes
              </p>
            )}
          </div>

          {/* Quick Name Suggestions */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
              Quick Suggestions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Property Manager', 'Owner', 'Administrator', 'Care Taker'].map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate('managerName', suggestion)}
                  className="text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Contact Details</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Phone number and other contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Phone Number
              {phoneNumber && !errors.phoneNumber && (
                <Badge className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Valid
                </Badge>
              )}
            </label>
            <Input
              value={phoneNumber}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                onUpdate('phoneNumber', formatted);
                if (errors.phoneNumber) {
                  setErrors(prev => ({ ...prev, phoneNumber: '' }));
                }
              }}
              placeholder="+91-9876543210"
              className={cn(
                "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700",
                errors.phoneNumber ? "border-red-500 dark:border-red-500" : 
                phoneNumber ? "border-green-300 dark:border-green-700" : ""
              )}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
            )}
            {!errors.phoneNumber && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                💡 Format: +91-9876543210 (auto-formatted)
              </p>
            )}
          </div>

          {/* Phone Format Quick Actions */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
              Country Codes
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PHONE_FORMATS.map((format) => (
                <Button
                  key={format.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate('phoneNumber', format.value + format.placeholder)}
                  className="text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  {format.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Contact Actions */}
          {phoneNumber && (
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                Quick Actions
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(phoneNumber)}
                  className="text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <Copy className="w-3 h-3 mr-2" />
                  Copy Number
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openPhoneDialer(phoneNumber)}
                  className="text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <Phone className="w-3 h-3 mr-2" />
                  Test Call
                </Button>
              </div>
            </div>
          )}

          {/* Contact Preview */}
          {(managerName || phoneNumber) && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">Guest View Preview</p>
                  <div className="mt-2 space-y-1">
                    {managerName && (
                      <p className="text-xs">
                        <span className="font-medium">Manager:</span> {managerName}
                      </p>
                    )}
                    {phoneNumber && (
                      <p className="text-xs">
                        <span className="font-medium">Contact:</span> {phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Contact Information Tips</p>
                <p className="text-xs mt-1">
                  Use a professional name and ensure the phone number is active. This information will be visible to potential guests for inquiries and bookings.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
