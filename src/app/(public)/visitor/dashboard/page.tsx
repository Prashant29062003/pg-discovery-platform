import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getClerkClient } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageSquare, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/db';
import { enquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function VisitorDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user info from Clerk
  const clerkClient = await getClerkClient();
  const user = await clerkClient.users.getUser(userId);

  // Get user's enquiries from database
  const userEnquiries: typeof enquiries.$inferSelect[] = [];
  try {
    const results = await db
      .select()
      .from(enquiries)
      .where(eq(enquiries.phone, user.phoneNumbers?.[0]?.phoneNumber || ''))
      .orderBy(enquiries.createdAt)
      .limit(20);
    
    userEnquiries.push(...results);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
  }

  return (
      <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <div id="dashboard-header" className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/pgs" className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to PGs
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">My Dashboard</h1>
              <p className="text-zinc-600 dark:text-zinc-400">Welcome back, {user.firstName}!</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold">
              {user.firstName?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Tabs defaultValue="enquiries" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="enquiries" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Enquiries</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Enquiries Tab */}
          <div id="enquiries">
            <TabsContent value="enquiries" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Enquiries</CardTitle>
                  <CardDescription>Track all your property enquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  {userEnquiries.length > 0 ? (
                    <div className="space-y-4">
                      {userEnquiries.map((enquiry, idx) => (
                        <div
                          key={idx}
                          className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-zinc-900 dark:text-white">{enquiry.name}</h3>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">{enquiry.phone}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              {enquiry.roomType}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{enquiry.message}</p>
                          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                            <span>
                              {enquiry.moveInDate
                                ? new Date(enquiry.moveInDate).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'Date not specified'}
                            </span>
                            <span>{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">No enquiries yet</p>
                      <Link href="/pgs">
                        <Button>Explore PGs</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Saved Tab */}
          <div id="saved">
            <TabsContent value="saved" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Properties</CardTitle>
                  <CardDescription>Your favorite PGs for quick access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">No saved properties yet</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
                      Heart icon feature coming soon!
                    </p>
                    <Link href="/pgs">
                      <Button>Browse PGs</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Profile Tab */}
          <div id="profile">
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                    <p className="text-lg text-zinc-900 dark:text-white mt-1">{user.fullName || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                    <p className="text-lg text-zinc-900 dark:text-white mt-1">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Account Type</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        Visitor
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Member Since</label>
                    <p className="text-lg text-zinc-900 dark:text-white mt-1">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      To update your profile, please visit Clerk Account Settings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
