'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getRoomBeds, createBed, updateRoom, createRoom } from '@/modules/pg/room.actions';
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
import { Home, IndianRupee, Layers3, AlertCircle, Bug, CheckCircle, AlertTriangle, Save, Plus } from 'lucide-react';
import BedManager from '@/components/admin/BedManager';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { getRoomTypeByBedCount, getRoomTypeDisplayName } from '@/lib/room-utils';
import { useRoomNumberValidation } from '@/hooks/useValidation';

const roomFormSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  type: z.enum(['SINGLE', 'DOUBLE', 'TRIPLE', 'OTHER']),
  basePrice: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Price must be a positive number'
  ),
  deposit: z.string().refine(
    (val) => !val || !isNaN(parseFloat(val)),
    'Deposit must be a valid number'
  ),
  noticePeriod: z.string().optional(),
  roomImages: z.array(z.string()).optional(),
});

type RoomFormData = z.infer<typeof roomFormSchema>;

interface RoomFormProps {
  pgId: string;
  roomId?: string;
  initialData?: Partial<RoomFormData>;
  initialBeds?: Array<{ id: string; bedNumber: string; isOccupied: boolean }>;
  onSuccess?: () => void;
}

export default function RoomForm({ pgId, roomId, initialData, initialBeds, onSuccess }: RoomFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [beds, setBeds] = useState<Array<{ id: string; bedNumber: string; isOccupied: boolean }>>(initialBeds || []);
  const previousBedsRef = useRef<Array<{ id: string; bedNumber: string; isOccupied: boolean }>>(initialBeds || []);
  const [roomType, setRoomType] = useState(initialData?.type || getRoomTypeByBedCount(initialBeds?.length || 0));
  const [roomImages, setRoomImages] = useState<string[]>(initialData?.roomImages || []);
  const [roomImageNames, setRoomImageNames] = useState<string[]>([]);

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
      type: initialData?.type || getRoomTypeByBedCount(initialBeds?.length || 0),
      basePrice: String(initialData?.basePrice || ''),
      deposit: String(initialData?.deposit || ''),
      noticePeriod: initialData?.noticePeriod || '1 Month',
    },
  });

  const roomNumber = watch('roomNumber');

  // Handle beds change - update room type based on bed count
  const handleBedsChange = useCallback((newBeds: Array<{ id: string; bedNumber: string; isOccupied: boolean }>) => {
    // Check if beds array actually changed by comparing with current state
    const currentBeds = beds;
    const bedsChanged = JSON.stringify(currentBeds) !== JSON.stringify(newBeds);
    
    if (bedsChanged) {
      setBeds(newBeds); // Update local state
      
      const suggestedType = getRoomTypeByBedCount(newBeds.length);
      if (suggestedType !== roomType) {
        setValue('type', suggestedType);
        setRoomType(suggestedType);
      }
    }
  }, []); // Empty dependency array - function never recreated

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

    // Check if any changes were made
    const roomData = {
      roomNumber: data.roomNumber.toUpperCase().trim(),
      type: data.type,
      basePrice: parseFloat(data.basePrice),
      deposit: data.deposit ? parseFloat(data.deposit) : undefined,
      pgId,
      noticePeriod: data.noticePeriod || '1 Month',
      roomImages: roomImages,
    };

    const hasRoomChanges = initialData ? (
      initialData.roomNumber !== roomData.roomNumber ||
      initialData.type !== roomData.type ||
      (initialData.basePrice ? parseFloat(initialData.basePrice) : 0) !== roomData.basePrice ||
      (initialData.deposit ? parseFloat(initialData.deposit) : 0) !== (roomData.deposit || 0) ||
      initialData.noticePeriod !== roomData.noticePeriod ||
      JSON.stringify(initialData.roomImages || []) !== JSON.stringify(roomImages || [])
    ) : true;

    const hasBedsChanges = JSON.stringify(initialBeds) !== JSON.stringify(beds);

    if (!hasRoomChanges && !hasBedsChanges) {
      showToast.info('No changes detected', 'No modifications were made to save');
      router.push(`/admin/pgs/${pgId}/rooms`);
      return;
    }

    setLoading(true);
    try {
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
      setLoading(false);
    }
  };


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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-0">
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-900/10 px-3 sm:px-6 py-3 sm:py-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 truncate">
                {roomId ? 'Edit Room' : 'Create New Room'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {roomId ? 'Update room details and pricing' : 'Add a new room to your property'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Room Number & Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                  className={`h-10 sm:h-11 pr-10 ${
                    errors.roomNumber ? 'border-red-500' : 
                    !validation.isValid && validation.message ? 'border-orange-500' : 
                    'border-zinc-200 dark:border-zinc-800'
                  }`}
                />
                {validation.isValid && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
                {!validation.isValid && validation.message && (
                  <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                )}
              </div>
              {validation.message && (
                <div className={`flex items-center gap-1.5 text-xs ${
                  validation.isValid ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {validation.isValid ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {validation.message}
                </div>
              )}
              {errors.roomNumber && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  {errors.roomNumber.message}
                </div>
              )}
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Room Type <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(value: "SINGLE" | "DOUBLE" | "TRIPLE" | "OTHER") => {
                    field.onChange(value);
                    setRoomType(value);
                  }}>
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">1-Bed Room</SelectItem>
                      <SelectItem value="DOUBLE">2-Bed Room</SelectItem>
                      <SelectItem value="TRIPLE">3-Bed Room</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Current: {getRoomTypeDisplayName(roomType as any)}
              </p>
            </div>
          </div>

          {/* Room Images */}
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800/50">
            <ImageUpload
              onImagesChange={setRoomImages}
              onImageNamesChange={setRoomImageNames}
              existingImages={roomImages}
              existingImageNames={roomImageNames}
              maxImages={4}
              label="Room Images"
              description="Add photos of this room to showcase its features"
              imageType="roomImage"
              pgName={`Room ${watch('roomNumber') || 'New'}`}
            />
          </div>

          {/* Beds Management */}
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Beds Configuration</h3>
            </div>
            
            <BedManager
              roomId={roomId}
              pgId={pgId}
              initialBeds={beds}
              onBedsChange={handleBedsChange}
              roomNumber={roomNumber}
            />
          </div>

          {/* Pricing Section */}
          <div className={`bg-gradient-to-br ${getRoomTypeColor()} rounded-lg p-4 sm:p-5 border border-zinc-100 dark:border-zinc-800/50`}>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-xs sm:text-sm font-bold uppercase text-zinc-700 dark:text-zinc-300">Pricing & Terms</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                    className={`h-10 sm:h-11 pl-7 transition-all ${
                      errors.basePrice
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                        : 'border-zinc-200 dark:border-zinc-800 focus:border-orange-500'
                    }`}
                  />
                </div>
                {errors.basePrice && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400">
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
                    className="h-10 sm:h-11 pl-7 border-zinc-200 dark:border-zinc-800 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Notice Period */}
            <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-zinc-200 dark:border-zinc-800/50">
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
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 sm:flex-none h-10 text-sm font-medium order-2 sm:order-1"
            >
              Cancel
            </Button>
            
            {roomId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/pgs/${pgId}/rooms/${roomId}`)}
                disabled={loading}
                className="flex-1 sm:flex-none h-10 text-sm font-medium order-3 sm:order-2"
              >
                View Room
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none h-10 text-sm font-medium bg-orange-600 hover:bg-orange-700 order-1 sm:order-3"
            >
              {loading ? (
                <>
                  <Bug className="w-4 h-4 mr-2 animate-spin" />
                  {roomId ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {roomId ? 'Update Room' : 'Create Room'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
