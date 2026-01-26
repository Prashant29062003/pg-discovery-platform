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
}

export function AddGuestDialog({ pgId, rooms, onSuccess }: AddGuestDialogProps) {
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
    
    if (!formData.roomId || !formData.name || !formData.checkInDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createGuest({
        pgId,
        roomId: formData.roomId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        status: formData.status as 'active' | 'checked-out' | 'upcoming',
        numberOfOccupants: parseInt(formData.numberOfOccupants),
        notes: formData.notes,
      });

      toast.success('Guest added successfully');
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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add guest');
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
          <DialogDescription>Enter guest details and room assignment</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Selection */}
          <div className="space-y-2">
            <Label htmlFor="roomId">Room *</Label>
            <Select value={formData.roomId} onValueChange={(value) => setFormData({ ...formData, roomId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
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
            <Label htmlFor="name">Guest Name *</Label>
            <Input
              id="name"
              placeholder="Enter guest name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="guest@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+91-XXXXXXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Check-in Date */}
          <div className="space-y-2">
            <Label htmlFor="checkInDate">Check-in Date *</Label>
            <Input
              id="checkInDate"
              type="date"
              value={formData.checkInDate}
              onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
              required
            />
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <Label htmlFor="checkOutDate">Check-out Date</Label>
            <Input
              id="checkOutDate"
              type="date"
              value={formData.checkOutDate}
              onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
            />
          </div>

          {/* Number of Occupants */}
          <div className="space-y-2">
            <Label htmlFor="numberOfOccupants">Number of Occupants</Label>
            <Input
              id="numberOfOccupants"
              type="number"
              min="1"
              value={formData.numberOfOccupants}
              onChange={(e) => setFormData({ ...formData, numberOfOccupants: e.target.value })}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any special notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Adding...' : 'Add Guest'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
