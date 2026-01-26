import { Users, Plus, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function GuestsPage() {
  const guests = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', room: 'Room 101', checkIn: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com', room: 'Room 205', checkIn: '2024-01-20', status: 'Active' },
    { id: 3, name: 'Amit Patel', email: 'amit@example.com', room: 'Room 103', checkIn: '2024-02-01', status: 'CheckOut Soon' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Residents</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Guests Management
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Track and manage current guests across all properties.
          </p>
        </div>
        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Guest
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active Guests', value: '24', color: 'cyan' },
          { label: 'Check-ins Today', value: '3', color: 'emerald' },
          { label: 'Avg Stay', value: '45 days', color: 'blue' },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Guests Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <th className="px-6 py-4 text-left font-bold">Guest Name</th>
                <th className="px-6 py-4 text-left font-bold">Contact</th>
                <th className="px-6 py-4 text-left font-bold">Room</th>
                <th className="px-6 py-4 text-left font-bold">Check-in</th>
                <th className="px-6 py-4 text-left font-bold">Status</th>
                <th className="px-6 py-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{guest.name}</td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${guest.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {guest.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{guest.room}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{guest.checkIn}</td>
                  <td className="px-6 py-4">
                    <Badge variant={guest.status === 'Active' ? 'default' : 'secondary'}>
                      {guest.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" className="text-xs">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
