'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Bed, 
  Edit, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import { updateBed, deleteBed, createBed } from '@/modules/pg/room.actions';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface Bed {
  id: string;
  bedNumber: string;
  isOccupied: boolean;
  roomId?: string;
}

interface BedManagerProps {
  roomId?: string;
  pgId: string;
  initialBeds?: Bed[];
  onBedsChange?: (beds: Bed[]) => void;
  roomNumber?: string;
}

export default function BedManager({
  roomId,
  pgId,
  initialBeds = [], 
  onBedsChange,
  roomNumber
}: BedManagerProps) {
  
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [editingBedId, setEditingBedId] = useState<string | null>(null);
  const [editingBedName, setEditingBedName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<any>(null);

  // Memoize sorted beds to prevent unnecessary re-renders
  const sortedBeds = useMemo(() => {
    return [...beds].sort((a, b) => {
      const aNum = parseInt(a.bedNumber.replace(/\D/g, ''), 10) || 0;
      const bNum = parseInt(b.bedNumber.replace(/\D/g, ''), 10) || 0;
      return aNum - bNum;
    });
  }, [beds]);

  // Memoize validation function to prevent re-renders
  const validateBedNumber = useMemo(() => {
    return (bedNumber: string, excludeId?: string) => {
      const isDuplicate = beds.some(bed => 
        bed.bedNumber.toLowerCase() === bedNumber.toLowerCase() &&
        bed.id !== excludeId
      );
      return {
        isValid: !isDuplicate,
        isDuplicate,
        message: isDuplicate ? 'Bed number already exists' : 'Bed number is available'
      };
    };
  }, [beds]);

  // Get current validation for editing bed
  const currentValidation = useMemo(() => {
    if (!editingBedId || !editingBedName.trim()) {
      return { isValid: true, isDuplicate: false, message: '' };
    }
    return validateBedNumber(editingBedName, editingBedId);
  }, [editingBedId, editingBedName, validateBedNumber]);

  const generateBedNumber = () => {
    // Use room-based naming convention if room number is available
    if (roomNumber) {
      // Extract room base (e.g., "102" from "102-A")
      const roomBase = roomNumber.match(/\d+/)?.[0] || roomNumber;
      
      // Extract existing bed suffix numbers from current beds
      const existingSuffixes = beds
        .map(b => {
          // Match pattern like "102-B04" and extract "04"
          const match = b.bedNumber.match(new RegExp(`^${roomBase}-B(\\d+)$`));
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => num > 0);
      
      // Find the next available number
      const nextNumber = existingSuffixes.length > 0 
        ? Math.max(...existingSuffixes) + 1 
        : 1;
      
      return `${roomBase}-B${nextNumber.toString().padStart(2, '0')}`;
    }
    
    // Enhanced fallback: Try to extract room base from existing beds or use generic professional naming
    const existingBedNumbers = beds.filter(b => b.bedNumber.includes('-B'));
    
    if (existingBedNumbers.length > 0) {
      // Extract room base from existing bed numbers (e.g., "102" from "102-B04")
      const firstBed = existingBedNumbers[0].bedNumber;
      const roomBase = firstBed.match(/^(\d+)-B/)?.[1];
      
      if (roomBase) {
        // Extract existing suffixes and find next number
        const existingSuffixes = existingBedNumbers
          .map(b => {
            const match = b.bedNumber.match(new RegExp(`^${roomBase}-B(\\d+)$`));
            return match ? parseInt(match[1], 10) : 0;
          })
          .filter(num => num > 0);
        
        const nextNumber = existingSuffixes.length > 0 
          ? Math.max(...existingSuffixes) + 1 
          : 1;
        
        return `${roomBase}-B${nextNumber.toString().padStart(2, '0')}`;
      }
    }
    
    // Final fallback - use professional generic naming
    const nextNumber = beds.length + 1;
    return `BED-${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleAddBed = useCallback(async () => {
    const bedNumber = generateBedNumber();
    
    if (roomId) {
      // For existing rooms, create bed via API
      setIsLoading(true);
      try {
        const newBed = await createBed({
          roomId: roomId || 'new',
          bedNumber: bedNumber.trim(),
          isOccupied: false,
        });
        
        // Transform the bed object to match the expected interface
        const transformedBed = {
          id: newBed.id,
          bedNumber: newBed.bedNumber || '',
          isOccupied: newBed.isOccupied,
        };
        
        setBeds([...beds, transformedBed]);
        onBedsChange?.([...beds, transformedBed]);
      } catch (error) {
        toast.error('Failed to add bed');
      } finally {
        setIsLoading(false);
      }
    } else {
      // For new rooms, add to local state only (will be created when room is saved)
      const newBed: Bed = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        bedNumber: bedNumber.trim(),
        isOccupied: false,
      };
      
      setBeds([...beds, newBed]);
      onBedsChange?.([...beds, newBed]);
    }
  }, [beds, roomId, onBedsChange, generateBedNumber]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setConfig(null);
  }, []);

  const handleDeleteBed = useCallback(async (bedId: string, bedNumber: string) => {
    setConfig({
      title: 'Delete Bed',
      description: `Are you sure you want to delete ${bedNumber}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => confirmDeleteBed(bedId)
    });
    setIsOpen(true);
  }, []);

  const confirmDeleteBed = useCallback(async (bedId: string) => {
    setIsLoading(true);
    try {
      if (roomId) {
        // For existing rooms, delete via API
        await deleteBed(bedId);
        const newBeds = beds.filter(bed => bed.id !== bedId);
        setBeds(newBeds);
        onBedsChange?.(newBeds);
        toast.success(`Bed deleted successfully`);
      } else {
        // For new rooms, just remove from local state
        const newBeds = beds.filter(bed => bed.id !== bedId);
        setBeds(newBeds);
        onBedsChange?.(newBeds);
      }
      setIsLoading(false);
      // Close dialog after successful deletion
      closeDialog();
    } catch (error) {
      console.error('Error deleting bed:', error);
      toast.error(`Failed to delete bed`);
      setIsLoading(false);
    }
  }, [beds, roomId, onBedsChange, closeDialog]);

  const startEditing = useCallback((bed: Bed) => {
    setEditingBedId(bed.id);
    setEditingBedName(bed.bedNumber);
  }, []);

  const saveBedName = useCallback(async () => {
    if (!editingBedId || !editingBedName.trim()) return;

    const trimmedBedName = editingBedName.trim();
    const validation = validateBedNumber(trimmedBedName, editingBedId);
    
    if (!validation.isValid) {
      toast.error('Validation Error', {
        description: validation.message,
        duration: 6000
      });
      return;
    }

    setIsLoading(true);
    try {
      if (roomId) {
        // For existing rooms, update via API
        const originalBed = beds.find(bed => bed.id === editingBedId);
        if (originalBed && originalBed.bedNumber !== trimmedBedName) {
          await updateBed(editingBedId, {
            bedNumber: trimmedBedName
          });
          
          // Update local state to reflect the change immediately
          const newBeds = beds.map(bed => 
            bed.id === editingBedId 
              ? { ...bed, bedNumber: trimmedBedName }
              : bed
          );
          setBeds(newBeds);
          onBedsChange?.(newBeds);
          
          toast.success(`Bed updated successfully: ${trimmedBedName} has been updated`);
        }
      } else {
        // For new rooms, update local state only
        const newBeds = beds.map(bed => 
          bed.id === editingBedId 
            ? { ...bed, bedNumber: trimmedBedName }
            : bed
        );
        setBeds(newBeds);
        onBedsChange?.(newBeds);
      }
      
      setEditingBedId(null);
      setEditingBedName('');
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating bed:', error);
      toast.error('Failed to update bed');
      setIsLoading(false);
    }
  }, [editingBedId, editingBedName, beds, roomId, validateBedNumber, onBedsChange]);

  const cancelEditing = useCallback(() => {
    setEditingBedId(null);
    setEditingBedName('');
  }, []);


  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Bed className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              Bed Configuration
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage bed arrangements and availability for this room
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Total Beds: <span className="font-semibold text-zinc-900 dark:text-zinc-50">{beds.length}</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-500">
              {beds.filter(b => !b.isOccupied).length} available
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
          {beds.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
                <Bed className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                No beds configured yet
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
                {roomId 
                  ? `Start by adding your first bed. We suggest "${generateBedNumber()}" as the bed number.`
                  : `Add beds to this room, then save to create them. The first bed will be "${generateBedNumber()}".`
                }
              </p>
              <Button
                onClick={handleAddBed}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Bed
              </Button>
            </div>
          ) : (
            <div className="p-6">
              {/* Beds Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedBeds.map((bed, index) => (
                  <Card 
                    key={bed.id} 
                    className="group relative overflow-hidden border bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl"
                  >
                    {/* Status Indicator Bar */}
                    <div className={`h-1 transition-all duration-300 ${
                      bed.isOccupied 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    }`} />
                    
                    <div className="p-4">
                      <CardHeader className="pb-3 px-0 pt-0">
                        <div className="flex flex-col items-center text-center space-y-3">
                          {/* Bed Icon */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            bed.isOccupied 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {editingBedId === bed.id ? (
                              <Edit className="w-6 h-6" />
                            ) : (
                              <Bed className="w-6 h-6" />
                            )}
                          </div>
                          
                          {/* Title and Status */}
                          <div className="w-full">
                            {editingBedId === bed.id ? (
                              <div className="space-y-2">
                                <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                  Edit Bed
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  Modify bed number
                                </CardDescription>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <CardTitle className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                  {bed.bedNumber}
                                </CardTitle>
                                <div className="flex items-center justify-center">
                                  <Badge 
                                    variant={bed.isOccupied ? "destructive" : "default"}
                                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                                      bed.isOccupied 
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' 
                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                    }`}
                                  >
                                    {bed.isOccupied ? 'Occupied' : 'Available'}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-3 px-0">
                        {editingBedId === bed.id ? (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`bed-number-${bed.id}`} className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1 block text-center">
                                Bed Number
                              </Label>
                              <Input
                                id={`bed-number-${bed.id}`}
                                value={editingBedName}
                                onChange={(e) => setEditingBedName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    saveBedName();
                                  }
                                }}
                                className="h-9 text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-md font-medium text-center"
                                placeholder="Enter bed number"
                                autoFocus
                              />
                            </div>
                            
                            {/* Validation Feedback */}
                            {editingBedName.trim() && (
                              <div className={`p-2 rounded-lg text-xs flex items-center justify-center gap-2 ${
                                currentValidation.isValid 
                                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                              }`}>
                                {currentValidation.isValid ? (
                                  <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
                                )}
                                <span>{currentValidation.message}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                            <span>Bed #{index + 1}</span>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="pt-0 px-0 pb-0">
                        {editingBedId === bed.id ? (
                          <div className="flex gap-2 w-full">
                            <Button
                              type="button"
                              onClick={saveBedName}
                              className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50"
                              disabled={!editingBedName.trim() || !currentValidation.isValid}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelEditing}
                              className="flex-1 h-8 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2 w-full">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => startEditing(bed)}
                              className="flex-1 h-8 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-medium rounded-md transition-colors duration-200"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleDeleteBed(bed.id, bed.bedNumber)}
                              className="flex-1 h-8 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-medium rounded-md transition-colors duration-200"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Enhanced Add Bed Button */}
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleAddBed}
                  disabled={isLoading}
                  variant="outline"
                  className="group border-2 border-dashed border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:border-solid hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Add Another Bed
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onConfirm={config?.onConfirm}
        title={config?.title || ''}
        description={config?.description || ''}
        confirmText={config?.confirmText || 'Confirm'}
        cancelText={config?.cancelText || 'Cancel'}
        variant={config?.variant || 'default'}
        isLoading={isLoading}
      />
    </>
  );
}
