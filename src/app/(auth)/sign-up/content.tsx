'use client';

import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
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

export default function SignUpContent() {
  const auth = useSignUp();
  const { isLoaded, signUp, setActive } = auth || {};
  const searchParams = useSearchParams();
  const isOwner = searchParams.get('role') === 'owner';
  
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  if (!isLoaded) return null;

  // Allow owner sign-up only if explicitly requested (for bootstrap)
  // Otherwise block with redirect to sign-in
  if (isOwner && searchParams?.get('bootstrap') !== 'true') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Owner Access</CardTitle>
            <CardDescription>
              Owner registration is restricted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Owner accounts are manually created by administrators. Please use the sign-in page with your credentials, or contact the admin team to register your property.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/sign-in?role=owner')} 
                className="flex-1"
              >
                Owner Sign In
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/sign-in')}
                className="flex-1"
              >
                Visitor Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!signUp) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signUp!.create({ emailAddress, password });
      await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors[0]?.message || err.message || "Sign-up failed");
    }
  }

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const completeSignup = await signUp!.attemptEmailAddressVerification({ code });
      if (completeSignup.status === "complete") {

        await setActive!({ session: completeSignup.createdSessionId });
        router.push("/pgs");
      }
    } catch (err: any) {
      setError(err.errors[0]?.message || err.message || "Verification failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className='flex justify-between items-center gap-4'>
            <div className='flex-1'>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Sign up to find your perfect PG
              </CardDescription>
            </div>
            <div className='text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap bg-blue-100 text-blue-900'>
              VISITOR
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!pendingVerification ? (
            // Sign Up Form
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          ) : (
            // Verification Form
            <form onSubmit={onPressVerify} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter the code from your email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Verify Email
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-zinc-500 italic border-t pt-3">
            👤 Visitor registration only. If you're a PG owner, please contact admin to list your property.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
