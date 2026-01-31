'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Bed, Edit2, Check, X, Edit, AlertTriangle, Users } from 'lucide-react';
import { createBed, deleteBed, updateBed, getRoomBeds, updateRoom } from '@/modules/pg/room.actions';
import { getRoomTypeByBedCount } from '@/lib/room-utils';
import { showToast } from '@/utils/toast';
import { ConfirmationDialog, useConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface Bed {
  id: string;
  bedNumber: string;
  isOccupied: boolean;
}

interface BedManagerProps {
  roomId?: string;
  pgId?: string;
  roomNumber?: string;
  initialBeds?: Bed[];
  onBedsChange?: (beds: Bed[]) => void;
}

export default function BedManager({ 
  roomId, 
  pgId,
  roomNumber,
  initialBeds = [], 
  onBedsChange
}: BedManagerProps) {
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [editingBedId, setEditingBedId] = useState<string | null>(null);
  const [editingBedName, setEditingBedName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, openDialog, closeDialog, config } = useConfirmationDialog();

  useEffect(() => {
    setBeds(initialBeds);
  }, [initialBeds]);

  const generateBedNumber = () => {
    const bedCount = beds.length + 1;
    // Use provided room number or extract from existing beds
    const currentRoomNumber = roomNumber || (beds.length > 0 
      ? beds[0].bedNumber.split('-')[0] 
      : 'Room');
    return `${currentRoomNumber}-B${bedCount.toString().padStart(2, '0')}`;
  };

  const updateRoomTypeInDatabase = async (bedCount: number) => {
    if (!roomId) return;
    
    try {
      const newRoomType = getRoomTypeByBedCount(bedCount);
      console.log(`Updating room ${roomId} to type ${newRoomType} based on ${bedCount} beds`);
      await updateRoom(roomId, { type: newRoomType });
      console.log(`Room type updated successfully to ${newRoomType}`);
      
      // Invalidate cache to refresh room list
      try {
        await fetch('/api/revalidate-cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'rooms', pgId: pgId })
        });
      } catch (cacheError) {
        console.log('Cache invalidation failed, but room type was updated:', cacheError);
      }
    } catch (error) {
      console.error('Error updating room type:', error);
    }
  };

  const addBed = async (e?: React.MouseEvent) => {
    // Prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // For existing rooms, save immediately to database
    // For new rooms, save to local state only
    if (roomId) {
      setIsLoading(true);
      try {
        const bedNumber = generateBedNumber();
        const result = await createBed({
          roomId,
          bedNumber,
          isOccupied: false
        });

        if (result.success) {
          // Refresh beds from database
          const updatedBeds = await getRoomBeds(roomId);
          const mappedBeds = updatedBeds.map(bed => ({
            id: bed.id,
            bedNumber: bed.bedNumber || `Bed-${bed.id.slice(-4)}`,
            isOccupied: bed.isOccupied
          }));
          
          setBeds(mappedBeds);
          onBedsChange?.(mappedBeds);
          
          // Update room type in database
          await updateRoomTypeInDatabase(mappedBeds.length);
          
          showToast.success('Bed added successfully', `${bedNumber} has been created`);
        }
      } catch (error) {
        console.error('Error adding bed:', error);
        showToast.error('Failed to add bed', 'Please try again');
      } finally {
        setIsLoading(false);
      }
    } else {
      // For new rooms, add to local state only
      setIsLoading(true);
      try {
        const bedNumber = generateBedNumber();
        console.log('Adding bed:', bedNumber.trim());
        console.log('Current beds before:', beds);
        
        const newBed: Bed = {
          id: Date.now().toString(),
          bedNumber: bedNumber.trim(),
          isOccupied: false
        };
        
        const newBeds = [...beds, newBed];
        console.log('New beds after add:', newBeds);
        
        setBeds(newBeds);
        onBedsChange?.(newBeds);
        
        const message = `${bedNumber} added to room (will be saved when room is created)`;
        showToast.success('Bed added successfully', message);
      } catch (error) {
        console.error('Error adding bed:', error);
        showToast.error('Failed to add bed', 'Please try again');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeBed = async (bedId: string, bedNumber: string, e?: React.MouseEvent) => {
    // Prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    openDialog({
      title: 'Delete Bed',
      description: `Are you sure you want to delete bed "${bedNumber}"? This action cannot be undone and will permanently remove this bed from the room.`,
      confirmText: 'Delete Bed',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: async () => {
        // For existing rooms, delete immediately from database
        // For new rooms, remove from local state only
        if (roomId) {
          setIsLoading(true);
          try {
            const result = await deleteBed(bedId);

            if (result.success) {
              // Refresh beds from database
              const updatedBeds = await getRoomBeds(roomId!);
              const mappedBeds = updatedBeds.map(bed => ({
                id: bed.id,
                bedNumber: bed.bedNumber || `Bed-${bed.id.slice(-4)}`,
                isOccupied: bed.isOccupied
              }));
              
              setBeds(mappedBeds);
              onBedsChange?.(mappedBeds);
              
              // Update room type in database
              await updateRoomTypeInDatabase(mappedBeds.length);
              
              showToast.success('Bed deleted successfully');
            }
          } catch (error) {
            console.error('Error removing bed:', error);
            showToast.error('Failed to delete bed', 'Please try again');
          } finally {
            setIsLoading(false);
          }
        } else {
          // For new rooms, remove from local state only
          const updatedBeds = beds.filter(bed => bed.id !== bedId);
          setBeds(updatedBeds);
          onBedsChange?.(updatedBeds);
          
          const message = 'Bed removed from room (will be saved when room is created)';
          showToast.success('Bed removed successfully', message);
        }
      }
    });
  };

  const startEditingBed = (bed: Bed) => {
    setEditingBedId(bed.id);
    setEditingBedName(bed.bedNumber);
  };

  const saveBedName = async (e?: React.MouseEvent) => {
    // Prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!editingBedId || !editingBedName.trim()) return;

    // For existing rooms, update immediately in database
    // For new rooms, update in local state only
    if (roomId) {
      setIsLoading(true);
      try {
        const result = await updateBed(editingBedId, {
          bedNumber: editingBedName.trim(),
          isOccupied: false // Keep existing occupation status
        });

        if (result.success) {
          // Refresh beds from database
          const updatedBeds = await getRoomBeds(roomId!);
          const mappedBeds = updatedBeds.map(bed => ({
            id: bed.id,
            bedNumber: bed.bedNumber || `Bed-${bed.id.slice(-4)}`,
            isOccupied: bed.isOccupied
          }));
          
          setBeds(mappedBeds);
          onBedsChange?.(mappedBeds);
          showToast.success('Bed name updated successfully');
          setEditingBedId(null);
          setEditingBedName('');
        }
      } catch (error) {
        console.error('Error updating bed:', error);
        showToast.error('Failed to update bed name', 'Please try again');
      } finally {
        setIsLoading(false);
      }
    } else {
      // For new rooms, update in local state only
      setIsLoading(true);
      try {
        const newBeds = beds.map(bed => 
          bed.id === editingBedId 
            ? { ...bed, bedNumber: editingBedName.trim() }
            : bed
        );
        
        setBeds(newBeds);
        onBedsChange?.(newBeds);
        
        const message = 'Bed name updated (will be saved when room is created)';
        showToast.success('Bed name updated successfully', message);
        setEditingBedId(null);
        setEditingBedName('');
      } catch (error) {
        console.error('Error updating bed:', error);
        showToast.error('Failed to update bed name', 'Please try again');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cancelEditing = () => {
    setEditingBedId(null);
    setEditingBedName('');
  };

  const roomTypeSuggestion = null; // Simplified - no more suggestions to avoid loops

  const getRoomTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      SINGLE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      DOUBLE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      TRIPLE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      OTHER: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300'
    };
    return colors[type] || colors.OTHER;
  };

  return (
    <>
      <div className="space-y-4">
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <h3 className="font-semibold text-sm sm:text-base">Bed Management</h3>
              <Badge variant="outline" className="ml-2 text-xs sm:text-sm">
                {beds.length} bed{beds.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <Button 
              type="button"
              onClick={addBed}
              size="sm"
              className="gap-2 bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto h-9 sm:h-10"
              disabled={isLoading}
              title="Add a new bed"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {isLoading ? 'Adding...' : 'Add Bed'}
            </Button>
          </div>

          {/* Beds List */}
          {beds.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <Bed className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs sm:text-sm">No beds added yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                {roomId 
                  ? 'Click "Add Bed" to create the first bed'
                  : 'Add beds above, then save the room to create them'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {beds.map((bed, index) => (
                <div key={bed.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-background border flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {editingBedId === bed.id ? (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Input
                          value={editingBedName}
                          onChange={(e) => setEditingBedName(e.target.value)}
                          className="h-7 sm:h-8 text-xs sm:text-sm"
                          placeholder="Bed name"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveBedName();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={saveBedName}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEditing}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm truncate">{bed.bedNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            Bed #{index + 1} in room
                            {!roomId && (
                              <span className="ml-1 text-orange-600 block sm:inline">
                                (will be created when room is saved)
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <Badge 
                            variant={bed.isOccupied ? "destructive" : "default"}
                            className="text-xs"
                          >
                            {bed.isOccupied ? 'Occupied' : 'Available'}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingBed(bed)}
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                            disabled={isLoading}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBed(bed.id, bed.bedNumber)}
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Room Type Info */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Room Type Rules:</p>
              <ul className="space-y-1">
                <li>• 1 bed = Single Occupancy</li>
                <li>• 2 beds = Double Occupancy</li>
                <li>• 3 beds = Triple Occupancy</li>
                <li>• 4+ beds = Multi-Occupancy</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onConfirm={config.onConfirm}
        title={config.title}
        description={config.description}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        variant={config.variant}
        isLoading={isLoading}
      />
    </>
  );
}
