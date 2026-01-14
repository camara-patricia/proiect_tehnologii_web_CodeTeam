import React from 'react';
import { EventGroup } from '@/app/types/index.js';
import { Folder, ChevronRight } from 'lucide-react';



export function EventGroupCard({ group, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left w-full group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Folder size={32} className="text-purple-600" />
        </div>
        <ChevronRight size={24} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
        {group.name}
      </h3>
      
      <p className="text-gray-600 text-sm line-clamp-2">
        {group.description}
      </p>
    </button>
  );
}
