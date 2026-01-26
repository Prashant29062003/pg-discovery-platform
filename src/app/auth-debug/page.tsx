'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AuthDebugPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      // This page is just for testing - in production you'd use proper auth
      toast.info('For testing: Please sign up as a visitor first, then contact admin to convert to owner account');
      window.location.href = '/sign-up';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Help</CardTitle>
          <CardDescription>Debug Clerk integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Issue: Clerk account not recognized</p>
            <p className="text-zinc-600 dark:text-zinc-400">
              If you created an account in Clerk Dashboard, it might not have a password set. Try:
            </p>
          </div>

          <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Go to Clerk Dashboard → Users → Your user → Change password</li>
            <li>Set a new password</li>
            <li>Try signing in again with that password</li>
          </ol>

          <div className="border-t pt-4 space-y-2">
            <p className="text-sm font-semibold">Or, try the visitor sign-up flow:</p>
            <Link href="/sign-up">
              <Button className="w-full" variant="outline">
                Sign Up as Visitor
              </Button>
            </Link>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-xs text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-1">Tip:</p>
            <p>Once signed up as visitor, contact your admin to upgrade your account to owner role.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
