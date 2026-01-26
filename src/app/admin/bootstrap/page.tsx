'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

/**
 * Bootstrap Admin Setup Page
 * 
 * This page allows you to:
 * 1. Create a new owner account at /sign-up?role=owner&bootstrap=true
 * 2. Set an existing Clerk user as admin by providing their user ID
 * 
 * After sign-up, use this page to assign the 'owner' role to your account.
 */
export default function BootstrapPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSetOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch('/api/admin/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: 'owner' }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to set role');
        return;
      }

      setMessage(`✅ Success! User ${userId} is now an owner. Sign in to access /admin`);
      setUserId("");
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🚀 Admin Bootstrap Setup</CardTitle>
          <CardDescription>Set up your first owner account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="font-semibold text-sm">Step 1: Create Your Account</div>
            <p className="text-xs text-zinc-600">
              Go to the sign-up page and create a new account with owner access:
            </p>
            <a 
              href="/sign-up?role=owner&bootstrap=true"
              className="inline-block text-blue-600 hover:underline font-semibold"
            >
              Create Owner Account →
            </a>
          </div>

          <div className="border-t" />

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="font-semibold text-sm">Step 2: Get Your User ID</div>
            <p className="text-xs text-zinc-600">
              After sign-up, go to{' '}
              <a href="https://dashboard.clerk.com" target="_blank" className="text-blue-600 hover:underline">
                Clerk Dashboard
              </a>
              {' '}and copy your user ID (looks like <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs">user_xxxxx</code>)
            </p>
          </div>

          <div className="border-t" />

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="font-semibold text-sm">Step 3: Set as Owner</div>
            <form onSubmit={handleSetOwner} className="space-y-3">
              <div>
                <Label htmlFor="userId">Clerk User ID</Label>
                <Input
                  id="userId"
                  placeholder="user_xxxxxxxxxxxxx"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert>
                  <AlertDescription className="text-green-700">{message}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Setting Role..." : "Set as Owner"}
              </Button>
            </form>
          </div>

          <div className="border-t" />

          {/* After Setup */}
          <div className="space-y-2">
            <div className="font-semibold text-sm">Next Steps:</div>
            <ul className="text-xs text-zinc-600 space-y-1 list-disc pl-5">
              <li>Sign in at <a href="/sign-in" className="text-blue-600 hover:underline">/sign-in</a></li>
              <li>You'll be redirected to <a href="/admin" className="text-blue-600 hover:underline">/admin</a> dashboard</li>
              <li>Visit <a href="/admin/users" className="text-blue-600 hover:underline">/admin/users</a> to manage other users</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
