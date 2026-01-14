import React, { useState, useEffect } from "react";
import { X, Calendar, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

export function EditEventModal({ event, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [state, setState] = useState("OPEN");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setName(event.name || "");
      // Convertim datele la formatul datetime-local
      setStartTime(formatDateTimeLocal(event.startTime));
      setEndTime(formatDateTimeLocal(event.endTime));
      setAccessCode(event.accessCode || "");
      setState(event.state || "OPEN");
    }
  }, [event]);

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Format: YYYY-MM-DDTHH:mm
    return date.toISOString().slice(0, 16);
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setAccessCode(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        id: event.id,
        name,
        state,
        groupId: event.groupId,
        startTime,
        endTime,
        accessCode,
        qrCodePath: `/qrcodes/${accessCode.toLowerCase()}.png`,
      });
      toast.success("Eveniment actualizat cu succes!");
      onClose();
    } catch (error) {
      toast.error("Eroare la actualizarea evenimentului");
    } finally {
      setLoading(false);
    }
  };

  const toggleState = () => {
    setState(state === "OPEN" ? "CLOSED" : "OPEN");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Calendar size={28} className="text-purple-600" />
            Editează eveniment
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
              Nume eveniment
            </label>
            <input
              id="eventName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="ex: Conferință Tech 2025"
              required
            />
          </div>

          {/* Stare eveniment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stare eveniment
            </label>
            <button
              type="button"
              onClick={toggleState}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-colors ${
                state === "OPEN" 
                  ? "border-green-500 bg-green-50 text-green-700" 
                  : "border-gray-300 bg-gray-50 text-gray-700"
              }`}
            >
              <span className="font-medium">
                {state === "OPEN" ? "DESCHIS - Se pot înregistra participanți" : "ÎNCHIS - Nu se mai pot înregistra"}
              </span>
              {state === "OPEN" ? (
                <ToggleRight size={28} className="text-green-600" />
              ) : (
                <ToggleLeft size={28} className="text-gray-400" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Data/ora început
              </label>
              <input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                Data/ora sfârșit
              </label>
              <input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
              Cod de acces
            </label>
            <div className="flex gap-2">
              <input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono uppercase"
                placeholder="CONF123"
                required
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
              >
                Regenerează
              </button>
            </div>
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ Dacă schimbi codul, participanții vor trebui să folosească noul cod
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                "Se salvează..."
              ) : (
                <>
                  <Save size={20} />
                  <span>Salvează</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
