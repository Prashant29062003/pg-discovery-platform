/**
 * Status & Visibility Tab Content Component
 */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Star, Globe, Lock, CheckCircle2, AlertCircle, Info, TrendingUp, Users, Calendar } from 'lucide-react';
import { cn } from '@/utils';
import { showToast } from '@/utils/toast';

interface StatusSectionProps {
  isPublished: boolean;
  isFeatured: boolean;
  onUpdate: (key: string, value: boolean) => void;
}

export function StatusSection({ isPublished, isFeatured, onUpdate }: StatusSectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [showUnfeatureConfirm, setShowUnfeatureConfirm] = useState(false);

  const validateStatus = () => {
    const newErrors: Record<string, string> = {};
    
    // Add validation logic if needed
    // For now, no validation errors for status
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useEffect(() => {
    validateStatus();
  }, [isPublished, isFeatured]);

  const handlePublishToggle = (value: boolean) => {
    if (!value && isPublished) {
      // Show custom warning for unpublishing
      showToast.warning(
        'Unpublish Property?',
        'This property will no longer be visible to guests. Click the Unpublish button below to confirm.'
      );
    } else {
      onUpdate('isPublished', value);
      if (value) {
        showToast.success(
          'Property Published',
          'Your property is now visible to guests and available for bookings!'
        );
      }
    }
  };

  const handleFeaturedToggle = (value: boolean) => {
    if (!value && isFeatured) {
      // Show custom warning for removing featured status
      showToast.warning(
        'Remove from Featured?',
        'This property will no longer be highlighted on the homepage and in search results. Click the Remove button below to confirm.'
      );
    } else if (value && !isFeatured) {
      onUpdate('isFeatured', value);
      showToast.success(
        'Property Featured!',
        'Your property is now featured and will appear prominently on the homepage and in search results.'
      );
    } else {
      onUpdate('isFeatured', value);
    }
  };

  const getStatusColor = (published: boolean, featured: boolean) => {
    if (!published) return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    if (featured) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
    return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
  };

  const getStatusText = (published: boolean, featured: boolean) => {
    if (!published) return 'Draft';
    if (featured) return 'Featured';
    return 'Published';
  };

  const getStatusIcon = (published: boolean, featured: boolean) => {
    if (!published) return <Lock className="w-3 h-3" />;
    if (featured) return <Star className="w-3 h-3" />;
    return <Globe className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Property Status & Visibility
          </CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Control how your property appears to guests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status Display */}
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", getStatusColor(isPublished, isFeatured))}>
                {getStatusIcon(isPublished, isFeatured)}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Current Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(isPublished, isFeatured)}>
                    {getStatusIcon(isPublished, isFeatured)}
                    <span className="ml-1">{getStatusText(isPublished, isFeatured)}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isPublished ? 'Visible to guests' : 'Hidden from guests'}
              </p>
              {isFeatured && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Featured on homepage
                </p>
              )}
            </div>
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

      {/* Publishing Options */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Publishing Options</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Control property visibility and availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Published Status */}
          <div className="space-y-3">
            <div 
              className={cn(
                "flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors group",
                isPublished 
                  ? "border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950/20" 
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              )}
              onClick={() => handlePublishToggle(!isPublished)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  isPublished 
                    ? "bg-green-600 border-green-600" 
                    : "bg-white border-zinc-300 dark:border-zinc-600"
                )}>
                  {isPublished && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Published
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {isPublished 
                      ? 'Property is visible to all guests' 
                      : 'Property is hidden from guests (draft mode)'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPublished && (
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <Eye className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                )}
                {!isPublished && (
                  <Badge className="bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Draft
                  </Badge>
                )}
              </div>
            </div>
            <div className="ml-8">
              <Button
                type="button"
                onClick={() => {
                  if (!isPublished) {
                    // Publishing - just do it
                    onUpdate('isPublished', true);
                    showToast.success(
                      'Property Published',
                      'Your property is now visible to guests and available for bookings!'
                    );
                  } else if (!showUnpublishConfirm) {
                    // First click - show warning
                    showToast.warning(
                      'Unpublish Property?',
                      'This property will no longer be visible to guests. Click the Unpublish button again to confirm.'
                    );
                    setShowUnpublishConfirm(true);
                    // Reset confirmation after 5 seconds
                    setTimeout(() => setShowUnpublishConfirm(false), 5000);
                  } else {
                    // Second click - actually unpublish
                    onUpdate('isPublished', false);
                    setShowUnpublishConfirm(false);
                    showToast.success(
                      'Property Unpublished',
                      'Property has been removed from public view. It is now in draft mode.'
                    );
                  }
                }}
                variant={isPublished ? "outline" : "default"}
                size="sm"
                className={cn(
                  "w-full",
                  isPublished 
                    ? showUnpublishConfirm 
                      ? "border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900" 
                      : "border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                    : "bg-green-600 hover:bg-green-700 text-white"
                )}
              >
                {isPublished ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    {showUnpublishConfirm ? 'Confirm Unpublish' : 'Unpublish Property'}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Publish Property
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Publishing Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">Publishing Guidelines</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Ensure all required information is filled before publishing</li>
                  <li>• Published properties appear in search results and browsing</li>
                  <li>• Draft properties are only visible to you</li>
                  <li>• You can unpublish at any time to make changes</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Options */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Featured Property</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Highlight your property on the homepage and search results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Featured Status */}
          <div className="space-y-3">
            <div 
              className={cn(
                "flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors group",
                isFeatured 
                  ? "border-yellow-500 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-950/20" 
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              )}
              onClick={() => handleFeaturedToggle(!isFeatured)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  isFeatured 
                    ? "bg-yellow-600 border-yellow-600" 
                    : "bg-white border-zinc-300 dark:border-zinc-600"
                )}>
                  {isFeatured && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Featured Property
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {isFeatured 
                      ? 'Property is highlighted on homepage and search results' 
                      : 'Property appears in normal search results only'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isFeatured && (
                  <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {!isFeatured && (
                  <Badge className="bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400">
                    <Users className="w-3 h-3 mr-1" />
                    Standard
                  </Badge>
                )}
              </div>
            </div>
            <div className="ml-8">
              <Button
                type="button"
                onClick={() => {
                  if (!isPublished) {
                    showToast.info(
                      'Publish First',
                      'Property must be published before it can be featured.'
                    );
                  } else if (!isFeatured) {
                    // Feature the property
                    onUpdate('isFeatured', true);
                    showToast.success(
                      'Property Featured!',
                      'Your property is now featured and will appear prominently on the homepage and in search results.'
                    );
                  } else if (!showUnfeatureConfirm) {
                    // First click - show warning
                    showToast.warning(
                      'Remove from Featured?',
                      'This property will no longer be highlighted on the homepage and in search results. Click the Remove button again to confirm.'
                    );
                    setShowUnfeatureConfirm(true);
                    // Reset confirmation after 5 seconds
                    setTimeout(() => setShowUnfeatureConfirm(false), 5000);
                  } else {
                    // Second click - actually unfeature
                    onUpdate('isFeatured', false);
                    setShowUnfeatureConfirm(false);
                    showToast.success(
                      'Removed from Featured',
                      'Property has been removed from featured status and will appear in normal search results.'
                    );
                  }
                }}
                variant={isFeatured ? "outline" : "default"}
                size="sm"
                disabled={!isPublished}
                className={cn(
                  "w-full",
                  !isPublished && "opacity-50 cursor-not-allowed",
                  isFeatured 
                    ? showUnfeatureConfirm
                      ? "border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900"
                      : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-950"
                    : "bg-yellow-600 hover:bg-yellow-700 text-white"
                )}
              >
                {isFeatured ? (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    {showUnfeatureConfirm ? 'Confirm Remove' : 'Remove from Featured'}
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Feature Property
                  </>
                )}
              </Button>
              {!isPublished && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
                  Property must be published first to be featured
                </p>
              )}
            </div>
          </div>

          {/* Featured Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mb-2" />
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Increased Visibility</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Appears on homepage and top of search results
              </p>
            </div>
            <div className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <Users className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mb-2" />
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">More Inquiries</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Featured properties get 3x more views on average
              </p>
            </div>
            <div className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <Calendar className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mb-2" />
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Priority Booking</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Higher conversion rates and faster bookings
              </p>
            </div>
          </div>

          {/* Featured Info */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Featured Property Benefits</p>
                <p className="text-xs mt-1">
                  Featured properties receive premium placement on the homepage and in search results, leading to increased visibility and more booking inquiries. This is ideal for properties with high-quality photos and complete information.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
