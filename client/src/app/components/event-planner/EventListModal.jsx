import React, { useState, useEffect } from "react";
import { eventsAPI, eventGroupsAPI } from "@/app/services/api.jsx";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { X, Plus, Calendar, Download } from "lucide-react";
import { EventCard } from "./EventCard";
import { CreateEventModal } from "./CreateEventModal";
import { EditEventModal } from "./EditEventModal";
import { ParticipantsModal } from "./ParticipantsModal";
import { ProjectorView } from "./ProjectorView";

export function EventListModal({ group, onClose }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [projectorEvent, setProjectorEvent] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [group.id]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventsAPI.getByGroupId(group.id);
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Eroare la încărcarea evenimentelor");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (data) => {
    try {
      const newEvent = await eventsAPI.create({ 
        ...data, 
        groupId: group.id,
        createdBy: user?.id 
      });
      setEvents([...events, newEvent]);
      setShowCreateEvent(false);
      toast.success("Eveniment creat!");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Eroare la crearea evenimentului");
    }
  };

  const handleUpdateEvent = async (data) => {
    try {
      const updatedEvent = await eventsAPI.update(data.id, data);
      setEvents(events.map(e => e.id === data.id ? updatedEvent : e));
      setEditingEvent(null);
      toast.success("Eveniment actualizat!");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Eroare la actualizarea evenimentului");
    }
  };

  const handleDeleteEvent = async (event) => {
    if (!window.confirm(`Sigur doriți să ștergeți evenimentul "${event.name}"?`)) {
      return;
    }
    try {
      await eventsAPI.delete(event.id, user?.id);
      setEvents(events.filter(e => e.id !== event.id));
      toast.success("Eveniment șters!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Eroare la ștergerea evenimentului");
    }
  };

  const handleExportGroup = async () => {
    setExportLoading(true);
    try {
      const blob = await eventGroupsAPI.exportToCsv(group.id);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `participanti-grup-${group.id}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
      toast.success("CSV grup descărcat!");
    } catch (e) {
      toast.error(e?.message || "Eroare la export grup");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full my-8">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-gray-900">{group.name}</h3>
              <p className="text-gray-600 line-clamp-2">{group.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportGroup}
                disabled={exportLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                title="Exportă participanții din toate evenimentele din acest grup"
              >
                <Download size={18} />
                <span className="hidden sm:inline">
                  {exportLoading ? "Se exportă..." : "Export grup CSV"}
                </span>
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Închide"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowCreateEvent(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium mb-6"
          >
            <Plus size={20} />
            <span>Adaugă eveniment</span>
          </button>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nu există evenimente</h4>
              <p className="text-gray-600">Adaugă primul eveniment în acest grup</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={() => setSelectedEvent(event)}
                  onProjector={(e) => setProjectorEvent(e)}
                  onEdit={(e) => setEditingEvent(e)}
                  onDelete={(e) => handleDeleteEvent(e)}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateEvent && (
        <CreateEventModal
          groupId={group.id}
          onClose={() => setShowCreateEvent(false)}
          onSubmit={handleCreateEvent}
        />
      )}

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSubmit={handleUpdateEvent}
        />
      )}

      {selectedEvent && (
        <ParticipantsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {projectorEvent && (
        <ProjectorView event={projectorEvent} onClose={() => setProjectorEvent(null)} />
      )}
    </>
  );
}
