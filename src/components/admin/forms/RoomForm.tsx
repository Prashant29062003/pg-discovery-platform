'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createRoom, updateRoom } from '@/modules/pg/room.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { showToast } from '@/utils/toast';
import { Home, IndianRupee, Layers3, AlertCircle, Bug, CheckCircle, AlertTriangle } from 'lucide-react';
import { BedManager } from '@/components/admin/BedManager';
import { getRoomTypeByBedCount, getRoomTypeDisplayName } from '@/lib/room-utils';
import { useRoomNumberValidation } from '@/hooks/useValidation';

const roomFormSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  type: z.enum(['SINGLE', 'DOUBLE', 'TRIPLE', 'OTHER']),
  basePrice: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Price must be a positive number'
  ),
  deposit: z.string().optional().refine(
    (val) => !val || !isNaN(parseFloat(val)),
    'Deposit must be a valid number'
  ),
  noticePeriod: z.string().optional(),
});

type RoomFormData = z.infer<typeof roomFormSchema>;

interface RoomFormProps {
  pgId: string;
  roomId?: string;
  initialData?: Partial<RoomFormData>;
  initialBeds?: Array<{ id: string; bedNumber: string; isOccupied: boolean }>;
}

export function RoomForm({ pgId, roomId, initialData, initialBeds = [] }: RoomFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [beds, setBeds] = useState<Array<{ id: string; bedNumber: string; isOccupied: boolean }>>(initialBeds);

  // Real-time validation for room number
  const { validation, validateRoomNumber, resetValidation } = useRoomNumberValidation(pgId, roomId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      roomNumber: initialData?.roomNumber || '',
      type: initialData?.type || getRoomTypeByBedCount(initialBeds.length),
      basePrice: String(initialData?.basePrice || ''),
      deposit: String(initialData?.deposit || ''),
      noticePeriod: initialData?.noticePeriod || '1 Month',
    },
  });

  const roomType = watch('type');
  const roomNumber = watch('roomNumber');

  // Debug function to check actual database state
  const debugRoomType = async () => {
    if (!roomId) return;
    
    try {
      const response = await fetch(`/api/debug-room-type?roomId=${roomId}`);
      const data = await response.json();
      
      console.log('🐛 Debug Room Type Data:', data);
      
      showToast.info('Debug Info', `Room ${data.roomNumber}: ${data.currentType} (${data.bedCount} beds) - Expected: ${data.expectedType} - Matches: ${data.typeMatches ? '✅' : '❌'}`);
    } catch (error) {
      console.error('Debug error:', error);
      showToast.error('Debug failed', 'Could not fetch room data');
    }
  };

  // Handle beds change - update room type based on bed count
  const handleBedsChange = (beds: Array<{ id: string; bedNumber: string; isOccupied: boolean }>) => {
    console.log('handleBedsChange called with beds:', beds.length, 'beds');
    setBeds(beds); // Update local state
    const suggestedType = getRoomTypeByBedCount(beds.length);
    console.log('Suggested room type:', suggestedType, 'Current room type:', roomType);
    if (suggestedType !== roomType) {
      console.log('Updating form room type from', roomType, 'to', suggestedType);
      setValue('type', suggestedType);
    } else {
      console.log('Room type already matches, no update needed');
    }
  };

  // Handle room number change with validation
  const handleRoomNumberChange = async (value: string) => {
    setValue('roomNumber', value);
    if (value.trim()) {
      await validateRoomNumber(value);
    } else {
      resetValidation();
    }
  };

  // Enhanced form submission with validation
  async function onSubmit(data: RoomFormData) {
    // Validate room number before submission
    const isRoomNumberValid = await validateRoomNumber(data.roomNumber);
    if (!isRoomNumberValid) {
      showToast.error('Validation Error', 'Room number already exists');
      return;
    }

    setIsSubmitting(true);
    try {
      const roomData = {
        roomNumber: data.roomNumber.toUpperCase().trim(),
        type: data.type,
        basePrice: parseFloat(data.basePrice),
        deposit: data.deposit ? parseFloat(data.deposit) : undefined,
        pgId,
        noticePeriod: data.noticePeriod || '1 Month',
      };
      
      if (roomId) {
        await updateRoom(roomId, roomData, beds);
        showToast.success("Room Updated", `Room #${roomData.roomNumber} has been saved successfully.`);
      } else {
        await createRoom(roomData, beds);
        showToast.success("Room Created", `Room #${roomData.roomNumber} has been created successfully.`);
      }
      router.push(`/admin/pgs/${pgId}/rooms`);
    } catch (error) {
      showToast.error("Update Failed", "There was an issue connecting to the database.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const getRoomTypeColor = () => {
    const colors: Record<string, string> = {
      SINGLE: 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20',
      DOUBLE: 'from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20',
      TRIPLE: 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20',
      OTHER: 'from-zinc-100 to-zinc-50 dark:from-zinc-900/30 dark:to-zinc-800/20',
    };
    return colors[roomType] || colors.SINGLE;
  };

  return (
    <div className="max-w-2xl">
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-900/10 px-6 py-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
              <Home className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {roomId ? 'Edit Room' : 'Create New Room'}
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-13">
            {roomId ? 'Update room details and pricing' : 'Add a new room to your property'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Room Number & Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Room Number */}
            <div className="space-y-2">
              <Label htmlFor="roomNumber" className="text-sm font-medium">
                Room Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="roomNumber"
                  {...register('roomNumber', { required: 'Room number is required' })}
                  placeholder="e.g., 101, A1, 201"
                  className={`h-11 pr-10 ${
                    errors.roomNumber ? 'border-red-500' : 
                    !validation.isValid && validation.message ? 'border-orange-500' : 
                    validation.isValid && validation.message ? 'border-green-500' : ''
                  }`}
                  onChange={(e) => handleRoomNumberChange(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validation.isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full"></div>
                  ) : !validation.isValid && validation.message ? (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  ) : validation.isValid && validation.message ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : null}
                </div>
              </div>
              {errors.roomNumber && (
                <p className="text-xs text-red-500">{errors.roomNumber.message}</p>
              )}
              {!errors.roomNumber && validation.message && (
                <p className={`text-xs ${
                  !validation.isValid ? 'text-orange-500' : 'text-green-500'
                }`}>
                  {validation.message}
                </p>
              )}
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Layers3 className="w-4 h-4" />
                <span>Room Type</span>
                <span className="text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded">
                  Auto-set by beds
                </span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single (1 Bed)</SelectItem>
                      <SelectItem value="DOUBLE">Double (2 Beds)</SelectItem>
                      <SelectItem value="TRIPLE">Triple (3 Beds)</SelectItem>
                      <SelectItem value="OTHER">Multi-Occupancy (4+ Beds)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Current: {getRoomTypeDisplayName(roomType as any)}
              </p>
            </div>
          </div>

          {/* Bed Management Section */}
          <BedManager
            roomId={roomId}
            pgId={pgId}
            roomNumber={watch('roomNumber')}
            initialBeds={initialBeds}
            onBedsChange={handleBedsChange}
          />

          {/* Pricing Section */}
          <div className={`bg-gradient-to-br ${getRoomTypeColor()} rounded-lg p-5 border border-zinc-100 dark:border-zinc-800/50`}>
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-sm font-bold uppercase text-zinc-700 dark:text-zinc-300">Pricing & Terms</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Base Price */}
              <div className="space-y-2">
                <Label htmlFor="basePrice" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Monthly Rent
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 font-medium">₹</span>
                  <Input
                    id="basePrice"
                    {...register('basePrice')}
                    placeholder="0"
                    className={`h-10 pl-7 transition-all ${
                      errors.basePrice
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                        : 'border-zinc-200 dark:border-zinc-800 focus:border-orange-500'
                    }`}
                  />
                </div>
                {errors.basePrice && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.basePrice.message}
                  </div>
                )}
              </div>

              {/* Deposit */}
              <div className="space-y-2">
                <Label htmlFor="deposit" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Security Deposit
                  <span className="text-zinc-400 ml-1 font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 font-medium">₹</span>
                  <Input
                    id="deposit"
                    {...register('deposit')}
                    placeholder="0"
                    className="h-10 pl-7 border-zinc-200 dark:border-zinc-800 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Notice Period */}
            <div className="mt-5 pt-5 border-t border-zinc-200 dark:border-zinc-800/50">
              <Label htmlFor="noticePeriod" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Notice Period
                <span className="text-zinc-400 ml-1 font-normal">(Optional)</span>
              </Label>
              <Input
                id="noticePeriod"
                {...register('noticePeriod')}
                placeholder="e.g., 1 Month, 30 Days"
                className="h-10 mt-2 border-zinc-200 dark:border-zinc-800 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1 h-10 text-sm font-medium"
            >
              Cancel
            </Button>
            
            {roomId && (
              <Button
                type="button"
                variant="outline"
                onClick={debugRoomType}
                disabled={isSubmitting}
                className="h-10 px-4 text-sm font-medium gap-2"
              >
                <Bug className="w-4 h-4" />
                Debug
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 h-10 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSubmitting ? 'Saving...' : roomId ? 'Update Room' : 'Create Room'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
