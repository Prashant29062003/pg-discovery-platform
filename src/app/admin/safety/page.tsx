import { ShieldCheck, Plus, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SafetyAuditPage() {
  const audits = [
    { id: 1, property: 'Elite Venue PG', date: '2024-02-10', status: 'Passed', score: '95%' },
    { id: 2, property: 'Royal PG', date: '2024-02-08', status: 'Passed', score: '87%' },
    { id: 3, property: 'Comfort Zone', date: '2024-02-05', status: 'Review', score: '72%' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Safety</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Safety Audit
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Monitor safety compliance and audit reports for all properties.
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Audit
        </Button>
      </div>

      {/* Compliance Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Properties', value: '12', icon: ShieldCheck, color: 'blue' },
          { label: 'Compliant', value: '10', icon: CheckCircle, color: 'emerald' },
          { label: 'Pending Review', value: '2', icon: AlertCircle, color: 'amber' },
        ].map((stat, i) => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 text-${stat.color}-500 opacity-50`} />
          </Card>
        ))}
      </div>

      {/* Audit Reports */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Recent Audits</h2>
        <div className="space-y-4">
          {audits.map((audit) => (
            <div key={audit.id} className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">{audit.property}</h3>
                <p className="text-sm text-zinc-500 flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4" />
                  {audit.date}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Badge variant={audit.status === 'Passed' ? 'default' : 'secondary'}>
                    {audit.status}
                  </Badge>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">{audit.score}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">Details</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Safety Checklist */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Safety Checklist</h2>
        <div className="space-y-3">
          {[
            'Fire extinguishers installed and checked',
            'Emergency exits clearly marked',
            'First aid kits available',
            'CCTV cameras operational',
            'Security gates functional',
            'Electrical wiring certified',
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors">
              <input type="checkbox" className="w-4 h-4 rounded" defaultChecked={i < 4} />
              <span className="text-sm text-zinc-900 dark:text-white">{item}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
