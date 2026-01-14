import React, { useState, useEffect } from 'react';
import { Event, EventUser } from '@/app/types/index.js';
import { eventUsersAPI } from '@/app/services/api.jsx';
import { X, Download, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';



export function ParticipantsModal({ event, onClose }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParticipants();
  }, [event.id]);

  const loadParticipants = async () => {
    try {
      const data = await eventUsersAPI.getParticipants(event.id);
      setParticipants(data);
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await eventUsersAPI.exportToCsv(event.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `participanti-${event.accessCode}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Fișier CSV descărcat!');
    } catch (error) {
      toast.error('Eroare la exportul CSV');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users size={28} className="text-purple-600" />
              {event.name}
            </h3>
            <p className="text-gray-600">Listă participanți prezenți</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            <span>Export CSV</span>
          </button>
          <div className="flex-1"></div>
          <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
            {participants.length} participanți
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Niciun participant încă
            </h4>
            <p className="text-gray-600">
              Participanții vor apărea aici după confirmarea prezenței
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {participant.firstName} {participant.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Clock size={14} />
                      <span>
                         Confirmat la: {format(new Date(participant.confirmedAt), 'd MMM yyyy, HH:mm')}
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Prezent
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}