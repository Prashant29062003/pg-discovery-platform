import { requireOwnerAccess } from '@/lib/auth';
import { getOwnerEnquiries } from '@/modules/enquiries/enquiry.actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnquiryStatusBadge } from '@/components/admin/dashboard/EnquiryStatusBadge';
import { EnquiryActions } from '@/components/visitor/dashboard/EnquiryActions';
import { format } from 'date-fns';
import { MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default async function EnquiriesPage() {
  await requireOwnerAccess();
  const enquiries = await getOwnerEnquiries();

  const pendingCount = enquiries.filter(e => e.status === 'NEW').length;
  const contactedCount = enquiries.filter(e => e.status === 'CONTACTED').length;
  const closedCount = enquiries.filter(e => e.status === 'CLOSED').length;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Enquiries Management
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2">
          Manage and respond to visitor enquiries for your properties
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Enquiries</p>
                <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-2">{enquiries.length}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pending</p>
                <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-2">{pendingCount}</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Contacted</p>
                <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-2">{contactedCount}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Closed</p>
                <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-2">{closedCount}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900/30 p-3 rounded-lg">
                <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enquiries Table */}
      <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Enquiries</CardTitle>
              <CardDescription className="mt-1">
                Latest visitor enquiries for your properties
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {enquiries.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No enquiries yet</p>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                Enquiries from visitors will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
                    <TableHead className="font-semibold text-zinc-950 dark:text-zinc-100">Name</TableHead>
                    <TableHead className="font-semibold text-zinc-950 dark:text-zinc-100">Phone</TableHead>
                    <TableHead className="font-semibold text-zinc-950 dark:text-zinc-100">Property</TableHead>
                    <TableHead className="font-semibold text-zinc-950 dark:text-zinc-100">Status</TableHead>
                    <TableHead className="font-semibold text-zinc-950 dark:text-zinc-100">Date</TableHead>
                    <TableHead className="text-right font-semibold text-zinc-950 dark:text-zinc-100">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((enquiry) => (
                    <TableRow
                      key={enquiry.id}
                      className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                        {enquiry.name}
                      </TableCell>
                      <TableCell className="text-zinc-600 dark:text-zinc-400">
                        {enquiry.phone}
                      </TableCell>
                      <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                        {enquiry.pgId || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <EnquiryStatusBadge status={enquiry.status} />
                      </TableCell>
                      <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                        {format(new Date(enquiry.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <EnquiryActions enquiryId={enquiry.id} currentStatus={enquiry.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
