import React from 'react';
import { Calendar, Clock, Users, Badge, Monitor, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export function EventCard({ event, onClick, onProjector, onEdit, onDelete, currentUserId }) {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  
  // Poate edita/șterge dacă este creatorul evenimentului sau dacă createdBy nu este setat (evenimente vechi)
  const canModify = currentUserId && (!event.createdBy || event.createdBy === currentUserId);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-purple-400 hover:shadow-md transition-all w-full group">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
          {event.name}
        </h4>
        <div className="flex items-center gap-2">
          {canModify && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit(event);
                }}
                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Editează eveniment"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(event);
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Șterge eveniment"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              event.state === 'OPEN'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {event.state === 'OPEN' ? 'DESCHIS' : 'ÎNCHIS'}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{format(startDate, 'd MMMM yyyy')}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>
            {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge size={16} />
          <span className="font-mono font-semibold text-purple-600">
            {event.accessCode}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between gap-2">
        <button
          onClick={onClick}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          <Users size={16} />
          <span>Vezi participanți</span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onProjector && onProjector(event);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
          title="Afișează pe proiector"
        >
          <Monitor size={16} />
          <span>Proiector</span>
        </button>
      </div>
    </div>
  );
}