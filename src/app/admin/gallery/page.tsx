import { Camera, Plus, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function LifeGalleryPage() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Camera className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Gallery</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Life Gallery
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage property photos and visual content across all your PGs.
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Upload Photos
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Photos', value: '156', color: 'purple' },
          { label: 'Last Updated', value: '2 hrs ago', color: 'blue' },
          { label: 'Storage Used', value: '2.4 GB', color: 'amber' },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Gallery Grid */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Recent Uploads</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center group relative overflow-hidden hover:shadow-lg transition-shadow">
              <Camera className="w-8 h-8 text-zinc-400" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Upload Area */}
      <Card className="p-12 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700">
        <Camera className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Drag & drop photos here</h3>
        <p className="text-sm text-zinc-500 mb-4">or click to browse</p>
        <Button variant="outline">Select Files</Button>
      </Card>
    </div>
  );
}
