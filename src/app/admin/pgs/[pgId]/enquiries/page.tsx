'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Phone, Mail, Calendar, User, MessageSquare, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyNavTabs } from '@/components/admin/PropertyNavTabs';
import { usePropertyData } from '@/hooks/usePropertyData';
import { toast } from 'sonner';

interface Enquiry {
  id: string;
  visitorName: string;
  email: string;
  phone: string;
  message: string;
  occupation?: string;
  roomType?: string;
  moveInDate?: string;
  status: 'NEW' | 'CONTACTED' | 'RESOLVED' | 'SPAM';
  createdAt: string;
  updatedAt?: string;
}

export default function EnquiriesPage() {
  const params = useParams();
  const pgId = params.pgId as string;
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Use optimized hook for data fetching with caching
  const { data: enquiries, pg, loading, error, refetch } = usePropertyData({
    pgId,
    dataType: 'enquiries',
  });

  // Update enquiry status
  const updateEnquiryStatus = async (enquiryId: string, status: string) => {
    setUpdatingStatus(enquiryId);
    try {
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Enquiry status updated successfully');
      refetch(); // Refresh the data
    } catch (error) {
      toast.error('Failed to update enquiry status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'NEW':
        return {
          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
          icon: <Clock className="w-3 h-3" />,
          label: 'New'
        };
      case 'CONTACTED':
        return {
          color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50',
          icon: <Phone className="w-3 h-3" />,
          label: 'Contacted'
        };
      case 'RESOLVED':
        return {
          color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
          icon: <CheckCircle className="w-3 h-3" />,
          label: 'Resolved'
        };
      case 'SPAM':
        return {
          color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
          icon: <XCircle className="w-3 h-3" />,
          label: 'Spam'
        };
      default:
        return {
          color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800/50',
          icon: <Clock className="w-3 h-3" />,
          label: status
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relative: getRelativeTime(date)
    };
  };

  // Get relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Handle contact actions
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/91${cleanPhone}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        </div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">PG not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 px-4 sm:px-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-1">
          <Link href="/admin/pgs">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-zinc-500 hover:text-orange-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Properties
            </Button>
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {pg?.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800/50">
              {enquiries?.length || 0} Enquiries
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage visitor enquiries and contact potential tenants.
          </p>
        </div>
      </div>

      {/* PROPERTY NAV TABS */}
      <PropertyNavTabs pgId={pgId} pgName={pg?.name} />

      {/* CONTENT AREA */}
      <div className="space-y-4">
        {!enquiries || enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-8 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/20">
            <div className="text-zinc-400 dark:text-zinc-500 text-center">
              <h3 className="font-semibold mb-2">No enquiries yet</h3>
              <p className="text-sm">Enquiries from visitors will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {enquiries.map((enquiry) => {
              const statusInfo = getStatusInfo(enquiry.status);
              const dateInfo = formatDate(enquiry.createdAt);
              
              return (
                <Card key={enquiry.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
                            {enquiry.visitorName}
                          </h3>
                          <Badge className={statusInfo.color}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{enquiry.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{enquiry.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{dateInfo.relative}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCall(enquiry.phone)}
                          className="gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWhatsApp(enquiry.phone)}
                          className="gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
                        {enquiry.message}
                      </p>
                      
                      {enquiry.occupation || enquiry.roomType || enquiry.moveInDate ? (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {enquiry.occupation && (
                            <Badge variant="secondary" className="gap-1">
                              <User className="w-3 h-3" />
                              {enquiry.occupation}
                            </Badge>
                          )}
                          {enquiry.roomType && (
                            <Badge variant="secondary" className="gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {enquiry.roomType}
                            </Badge>
                          )}
                          {enquiry.moveInDate && (
                            <Badge variant="secondary" className="gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(enquiry.moveInDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      ) : null}
                      
                      {/* Status Update Actions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                        {enquiry.status === 'NEW' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateEnquiryStatus(enquiry.id, 'CONTACTED')}
                              disabled={updatingStatus === enquiry.id}
                              className="text-xs"
                            >
                              {updatingStatus === enquiry.id ? 'Updating...' : 'Mark as Contacted'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateEnquiryStatus(enquiry.id, 'RESOLVED')}
                              disabled={updatingStatus === enquiry.id}
                              className="text-xs"
                            >
                              {updatingStatus === enquiry.id ? 'Updating...' : 'Mark as Resolved'}
                            </Button>
                          </>
                        )}
                        {enquiry.status === 'CONTACTED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateEnquiryStatus(enquiry.id, 'RESOLVED')}
                            disabled={updatingStatus === enquiry.id}
                            className="text-xs"
                          >
                            {updatingStatus === enquiry.id ? 'Updating...' : 'Mark as Resolved'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateEnquiryStatus(enquiry.id, 'SPAM')}
                          disabled={updatingStatus === enquiry.id}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          {updatingStatus === enquiry.id ? 'Updating...' : 'Mark as Spam'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedEnquiry(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Enquiry Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                    <p className="text-lg font-semibold">{selectedEnquiry.visitorName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
                    <Badge className={getStatusInfo(selectedEnquiry.status).color}>
                      {getStatusInfo(selectedEnquiry.status).icon}
                      {getStatusInfo(selectedEnquiry.status).label}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{selectedEnquiry.email}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmail(selectedEnquiry.email)}
                        className="gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{selectedEnquiry.phone}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(selectedEnquiry.phone)}
                        className="gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWhatsApp(selectedEnquiry.phone)}
                        className="gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {(selectedEnquiry.occupation || selectedEnquiry.roomType || selectedEnquiry.moveInDate) && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {selectedEnquiry.occupation && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Occupation</label>
                        <p className="text-sm">{selectedEnquiry.occupation}</p>
                      </div>
                    )}
                    {selectedEnquiry.roomType && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Room Type</label>
                        <p className="text-sm">{selectedEnquiry.roomType}</p>
                      </div>
                    )}
                    {selectedEnquiry.moveInDate && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Move-in Date</label>
                        <p className="text-sm">{new Date(selectedEnquiry.moveInDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
                  <p className="text-sm bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg">
                    {selectedEnquiry.message}
                  </p>
                </div>

                {/* Timestamps */}
                <div className="grid md:grid-cols-2 gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <div>
                    <label className="font-medium">Created</label>
                    <p>{formatDate(selectedEnquiry.createdAt).date} at {formatDate(selectedEnquiry.createdAt).time}</p>
                  </div>
                  {selectedEnquiry.updatedAt && (
                    <div>
                      <label className="font-medium">Last Updated</label>
                      <p>{formatDate(selectedEnquiry.updatedAt).date} at {formatDate(selectedEnquiry.updatedAt).time}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  {selectedEnquiry.status === 'NEW' && (
                    <>
                      <Button
                        onClick={() => {
                          updateEnquiryStatus(selectedEnquiry.id, 'CONTACTED');
                          setSelectedEnquiry(null);
                        }}
                        disabled={updatingStatus === selectedEnquiry.id}
                        className="gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {updatingStatus === selectedEnquiry.id ? 'Updating...' : 'Mark as Contacted'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          updateEnquiryStatus(selectedEnquiry.id, 'RESOLVED');
                          setSelectedEnquiry(null);
                        }}
                        disabled={updatingStatus === selectedEnquiry.id}
                        className="gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {updatingStatus === selectedEnquiry.id ? 'Updating...' : 'Mark as Resolved'}
                      </Button>
                    </>
                  )}
                  {selectedEnquiry.status === 'CONTACTED' && (
                    <Button
                      onClick={() => {
                        updateEnquiryStatus(selectedEnquiry.id, 'RESOLVED');
                        setSelectedEnquiry(null);
                      }}
                      disabled={updatingStatus === selectedEnquiry.id}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {updatingStatus === selectedEnquiry.id ? 'Updating...' : 'Mark as Resolved'}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateEnquiryStatus(selectedEnquiry.id, 'SPAM');
                      setSelectedEnquiry(null);
                    }}
                    disabled={updatingStatus === selectedEnquiry.id}
                    className="gap-2 text-red-600 hover:text-red-700"
                  >
                    <XCircle className="w-4 h-4" />
                    {updatingStatus === selectedEnquiry.id ? 'Updating...' : 'Mark as Spam'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
