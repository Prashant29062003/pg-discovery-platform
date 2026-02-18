'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { createGuest } from '@/modules/guests/guest.actions';
import { toast } from 'sonner';

interface Room {
  id: string;
  roomNumber: string;
}

interface AddGuestDialogProps {
  pgId: string;
  rooms: Room[];
  onSuccess?: () => void;
  onGuestAdded?: () => void; // Add this callback
}

export function AddGuestDialog({ pgId, rooms, onSuccess, onGuestAdded }: AddGuestDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfOccupants: '1',
    status: 'active',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!formData.roomId) {
      toast.error('Please select a room for the guest');
      return;
    }
    
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error('Guest name must be at least 2 characters');
      return;
    }
    
    if (!formData.checkInDate) {
      toast.error('Please select a check-in date');
      return;
    }

    // Phone validation (if provided)
    if (formData.phone && formData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Phone number must be at least 10 digits');
      return;
    }

    // Email validation (if provided)
    if (formData.email && !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const guestData = {
        pgId,
        roomId: formData.roomId,
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate || undefined,
        status: formData.status as 'active' | 'checked-out' | 'upcoming',
        numberOfOccupants: parseInt(formData.numberOfOccupants),
        notes: formData.notes.trim() || undefined,
      };

      console.log('🚀 Sending guest data to server:', guestData);

      const result = await createGuest(guestData);
      console.log('✅ Server response:', result);

      toast.success('Guest added successfully!');
      setOpen(false);
      setFormData({
        roomId: '',
        name: '',
        email: '',
        phone: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfOccupants: '1',
        status: 'active',
        notes: '',
      });
      onSuccess?.();
      onGuestAdded?.(); // Call the refresh callback
    } catch (error) {
      console.error('Guest creation error:', error);
      
      // Handle Zod validation errors
      if (error instanceof Error && error.message.includes('Invalid phone number')) {
        toast.error('Phone number must be at least 10 digits');
      } else if (error instanceof Error && error.message.includes('Invalid email address')) {
        toast.error('Please enter a valid email address');
      } else if (error instanceof Error && error.message.includes('at least')) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add guest. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Guest
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
          <DialogDescription>
            Enter guest details and room assignment. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Selection */}
          <div className="space-y-2">
            <Label htmlFor="roomId" className="text-sm font-medium">
              Room Assignment <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.roomId} onValueChange={(value) => setFormData({ ...formData, roomId: value })}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a room for this guest" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    Room {room.roomNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guest Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Guest Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter guest's full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10"
              required
            />
            <p className="text-xs text-zinc-500">Minimum 2 characters required</p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="guest@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-10"
            />
            <p className="text-xs text-zinc-500">Optional - for booking confirmations</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="+91-9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-10"
            />
            <p className="text-xs text-zinc-500">Optional - minimum 10 digits required</p>
          </div>

          {/* Check-in Date */}
          <div className="space-y-2">
            <Label htmlFor="checkInDate" className="text-sm font-medium">
              Check-in Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="checkInDate"
              type="date"
              value={formData.checkInDate}
              onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
              className="h-10"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <Label htmlFor="checkOutDate" className="text-sm font-medium">
              Check-out Date
            </Label>
            <Input
              id="checkOutDate"
              type="date"
              value={formData.checkOutDate}
              onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
              className="h-10"
              min={formData.checkInDate || new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-zinc-500">Optional - leave empty if unknown</p>
          </div>

          {/* Number of Occupants */}
          <div className="space-y-2">
            <Label htmlFor="numberOfOccupants" className="text-sm font-medium">
              Number of Occupants
            </Label>
            <Input
              id="numberOfOccupants"
              type="number"
              min="1"
              max="10"
              value={formData.numberOfOccupants}
              onChange={(e) => setFormData({ ...formData, numberOfOccupants: e.target.value })}
              className="h-10"
            />
            <p className="text-xs text-zinc-500">How many guests will be staying?</p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Booking Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active (Checked-in)</SelectItem>
                <SelectItem value="upcoming">Upcoming (Future Booking)</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Special Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any special requests, preferences, or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-zinc-500">Optional - dietary needs, accessibility, etc.</p>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Guest...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Guest
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
