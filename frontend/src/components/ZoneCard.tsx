'use client';

import type { ZoneData } from '@/types/iosense';

interface ZoneCardProps {
  zone: ZoneData;
  direction: 'up' | 'down' | 'left' | 'right';
}

export default function ZoneCard({ zone, direction }: ZoneCardProps) {
  const statusColors = {
    'Healthy': 'bg-green-500',
    'Warning': 'bg-yellow-500',
    'Action Recommended': 'bg-red-500',
  };

  const statusBadgeColors = {
    'Healthy': 'bg-green-100 text-green-800',
    'Warning': 'bg-yellow-100 text-yellow-800',
    'Action Recommended': 'bg-red-100 text-red-800',
  };

  const directionIcons = {
    'up': '↑',
    'down': '↓',
    'left': '←',
    'right': '→',
  };

  const getStrokeDashoffset = (score: number) => {
    const circumference = 2 * Math.PI * 70;
    return circumference - (score / 100) * circumference;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${statusColors[zone.status]} flex items-center justify-center text-white font-bold text-xl`}>
            {directionIcons[direction]}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeColors[zone.status]}`}>
          {zone.status}
        </span>
      </div>

      {/* Health Score Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={zone.status === 'Healthy' ? '#22c55e' : zone.status === 'Warning' ? '#eab308' : '#ef4444'}
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={getStrokeDashoffset(zone.healthScore)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-900">{zone.healthScore}%</span>
            <span className="text-sm text-gray-600">Health Score</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{zone.totalChambers}</div>
          <div className="text-xs text-gray-600">Total Chambers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{zone.inactiveChambers.toString().padStart(2, '0')}</div>
          <div className="text-xs text-gray-600">Inactive Chambers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{zone.doorOpen}</div>
          <div className="text-xs text-gray-600">Door Open</div>
        </div>
      </div>

      {/* Threshold Metrics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Within Threshold</div>
          <div className="text-xl font-bold text-gray-900">{zone.withinThreshold}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Above Threshold</div>
          <div className="text-xl font-bold text-red-600">{zone.aboveThreshold}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Below Threshold</div>
          <div className="text-xl font-bold text-blue-600">{zone.belowThreshold}</div>
        </div>
      </div>
    </div>
  );
}
