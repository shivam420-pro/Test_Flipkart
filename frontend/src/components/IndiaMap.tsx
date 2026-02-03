'use client';

import Image from 'next/image';
import type { ZoneData } from '@/types/iosense';

interface IndiaMapProps {
  zones: ZoneData[];
}

export default function IndiaMap({ zones }: IndiaMapProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Zone Overview</h2>

      {/* India Zone Map Image */}
      <div className="w-full max-w-3xl mx-auto">
        <Image
          src="/india-detailed-four-zones.svg"
          alt="India Zone Map showing North, South, East, and West zones with health status"
          width={900}
          height={900}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-300 border border-gray-500"></div>
          <span className="text-gray-700 font-medium">Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-200 border border-gray-500"></div>
          <span className="text-gray-700 font-medium">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-300 border border-gray-500"></div>
          <span className="text-gray-700 font-medium">Action Recommended</span>
        </div>
      </div>
    </div>
  );
}
