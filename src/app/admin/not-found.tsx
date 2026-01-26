import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-red-500/10 p-6 rounded-full">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-bold text-white mb-2">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8">
          The admin page you're looking for doesn't exist or has been moved. This might be a typo or the page has been removed.
        </p>

        {/* Error Details */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-8 text-left">
          <p className="text-sm text-gray-300">
            <span className="text-gray-500">Error Type:</span> Not Found
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <span className="text-gray-500">Status Code:</span> 404
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <p className="text-sm text-gray-400 font-medium mb-4">Quick Links:</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin">
              <Button
                variant="outline"
                className="w-full border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/pgs">
              <Button
                variant="outline"
                className="w-full border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                Properties
              </Button>
            </Link>
            <Link href="/admin/enquiries">
              <Button
                variant="outline"
                className="w-full border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                Enquiries
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button
                variant="outline"
                className="w-full border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Actions */}
        <div className="flex gap-3 mt-8">
          <Button
            asChild
            variant="outline"
            className="flex-1 border-gray-600 hover:bg-gray-700"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Link href="/admin">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>

        {/* Footer Help */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            Need help? Contact{' '}
            <a href="mailto:support@pgdiscovery.com" className="text-blue-400 hover:text-blue-300">
              support@pgdiscovery.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
