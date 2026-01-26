import { requireOwnerAccess } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, LogOut, Copy, Lock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function SettingsPage() {
  await requireOwnerAccess();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">Settings</h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2">
          Manage your account and security preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        {/* Account & Security */}
        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl md:text-2xl">Account & Security</CardTitle>
                <CardDescription className="mt-2">
                  Managed through Clerk authentication. Click links below to make changes.
                </CardDescription>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                ✅ Authentication Status
              </p>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                Logged in via Clerk
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" className="border-zinc-200 dark:border-zinc-700">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl md:text-2xl">Notifications</CardTitle>
                <CardDescription className="mt-2">
                  Email notifications for property updates and inquiries
                </CardDescription>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">New Inquiries</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Get notified when visitors inquire about your properties</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Booking Updates</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Receive updates on bookings and room status changes</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Weekly Reports</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Summary of occupancy and inquiries every Monday</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Developer Info */}
        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl md:text-2xl">System Info</CardTitle>
                <CardDescription className="mt-2">
                  Application and storage information
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">v1.0.0</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Storage</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Cloudinary CDN</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Images optimized & cached</p>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Database</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">PostgreSQL</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Cached globally via Zustand</p>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Framework</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Next.js 14</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Server + Client Rendering</p>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Auth</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Clerk</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Secure identity management</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
