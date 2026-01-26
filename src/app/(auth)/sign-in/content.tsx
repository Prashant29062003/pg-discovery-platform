'use client';

import React, { useState, useEffect } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { Eye, EyeOff } from "lucide-react";
import { getUserRoleAction } from '@/modules/auth/auth.actions';

export default function SignInContent() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const searchParams = useSearchParams();

  // Check if this is owner login attempt via URL param
  useEffect(() => {
    const roleParam = searchParams?.get('role');
    setIsOwner(roleParam === 'owner');
  }, [searchParams]);

  const router = useRouter();

  if (!isLoaded) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!signIn || !setActive) {
      setError("Authentication service not ready. Please refresh.");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        
        // Get user role from Clerk metadata via server action
        // The user ID is available from the session that was just created
        const userRole = await getUserRoleAction();
        const isOwnerUser = userRole === 'owner';
        
        router.push(isOwnerUser ? "/admin" : "/pgs");
      } else {
        setError(`Sign-in incomplete. Status: ${result.status}`);
        console.log("Sign-in result:", result);
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      const errorMsg = err.errors?.[0]?.message || err.message || "Sign-in failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-800 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className='flex justify-between items-center gap-4'>
            <div className='flex-1'>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                {isOwner 
                  ? 'PG Owner Portal' 
                  : 'Find your perfect PG'}
              </CardDescription>
            </div>
            <div className='text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap' 
              style={{backgroundColor: isOwner ? '#fee2e2' : '#dbeafe', color: isOwner ? '#991b1b' : '#1e40af'}}>
              {isOwner ? 'OWNER' : 'VISITOR'}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t pt-4">
          <div className="mt-4 text-sm">
            {!isOwner ? (
              <div className="space-y-2">
                <p>
                  New here? <Link href="/sign-up" className="font-semibold text-orange-600 hover:text-orange-700">Create an account</Link>
                </p>
                <p className="text-xs text-zinc-500">
                  Looking to list your PG? <Link href="/sign-in?role=owner" className="text-blue-600 hover:underline">Sign in as owner</Link>
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-zinc-600 font-medium">
                  📍 PG Owner Portal
                </p>
                <p className="text-xs text-zinc-500 italic">
                  Owner accounts are manually created by administrators. If you don't have credentials yet, please contact the admin team.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/sign-in')} 
                  className="text-xs"
                >
                  Not an owner? Sign in as visitor
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
