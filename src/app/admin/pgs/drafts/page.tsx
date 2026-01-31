'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  FileText, 
  Trash2, 
  Edit, 
  Calendar,
  Building,
  Loader2 
} from 'lucide-react';
import { showToast } from '@/utils/toast';
import Link from 'next/link';

interface Draft {
  id: string;
  pgId: string | null;
  title: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await fetch('/api/admin/pgs/draft');
      const data = await response.json();
      
      if (data.drafts) {
        setDrafts(data.drafts);
      }
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
      showToast.error('Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (draftId: string) => {
    try {
      const response = await fetch(`/api/admin/pgs/draft?draftId=${draftId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setDrafts(drafts.filter(d => d.id !== draftId));
        showToast.success('Draft deleted successfully');
      } else {
        throw new Error('Failed to delete draft');
      }
    } catch (error) {
      console.error('Failed to delete draft:', error);
      showToast.error('Failed to delete draft');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDraftStatus = (draft: Draft) => {
    const hoursSinceUpdate = (Date.now() - new Date(draft.updatedAt).getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate < 1) return { label: 'Just now', color: 'bg-green-100 text-green-800' };
    if (hoursSinceUpdate < 24) return { label: 'Recent', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Old', color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PG Drafts</h1>
          <p className="text-gray-600 mt-2">
            Auto-saved drafts of your PG creations. Never lose your progress again.
          </p>
        </div>
        <Link href="/admin/pgs/new">
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Create New PG
          </Button>
        </Link>
      </div>

      {drafts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No drafts found</h3>
            <p className="text-gray-600 text-center mb-6">
              Your auto-saved drafts will appear here. Start creating a new PG to see drafts in action.
            </p>
            <Link href="/admin/pgs/new">
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Create Your First PG
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft) => {
            const status = getDraftStatus(draft);
            const isComplete = draft.data.name && draft.data.city && draft.data.address;
            
            return (
              <Card key={draft.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{draft.title}</CardTitle>
                        <Badge className={status.color}>{status.label}</Badge>
                        {isComplete && (
                          <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(draft.updatedAt)}
                        </div>
                        {draft.data.city && (
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {draft.data.city}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/pgs/new?draft=${draft.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDraft(draft.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    Last auto-saved {formatDate(draft.updatedAt)}
                  </div>
                  
                  {draft.data.name && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">PG Name:</span> {draft.data.name}
                    </div>
                  )}
                  
                  {draft.data.description && (
                    <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {draft.data.description.substring(0, 150)}...
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
