'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit2, Trash2, Star } from 'lucide-react';
import { toggleFeaturedPG, deletePG } from '@/modules/pg/pg.actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { cn } from '@/utils';

interface PGListItemProps {
    pg: {
        id: string;
        slug: string;
        name: string;
        description: string;
        city: string;
        locality: string;
        isFeatured: boolean;
    };
}

export function PGListItem({ pg }: PGListItemProps) {
    const [isFeatured, setIsFeatured] = useState(pg.isFeatured);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleToggleFeatured() {
        try {
            const result = await toggleFeaturedPG(pg.id);
            setIsFeatured(result.isFeatured);
            toast.success(`PG ${result.isFeatured ? 'marked as' : 'unmarked from'} featured`);
        } catch (error) {
            toast.error('Failed to update featured status');
            console.error(error);
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this PG? This cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deletePG(pg.id);
            toast.success('PG deleted successfully');
        } catch (error) {
            toast.error('Failed to delete PG');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pg.name}</h3>
                    <p className="text-sm text-gray-600">
                        {pg.locality}, {pg.city}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFeatured}
                    className={cn(
                        "rounded-lg transition-colors",
                        isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
                    )}
                >
                    <Star className="w-5 h-5" fill={isFeatured ? 'currentColor' : 'none'} />
                </Button>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pg.description}</p>

            <div className="flex gap-2">
                <Link href={`/admin/pgs/${pg.id}/details`} className="flex-1">
                    <Button className="w-full gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit Details
                    </Button>
                </Link>
                <Link href={`/admin/pgs/${pg.id}/rooms`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                        🏠
                        Manage Rooms
                    </Button>
                </Link>
                <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </Button>
            </div>
        </Card>
    );
}
