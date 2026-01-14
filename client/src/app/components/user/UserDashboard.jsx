import React, { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { eventUsersAPI } from '@/app/services/api.jsx';
import { QrCode, KeyRound, LogOut, CheckCircle } from 'lucide-react';
import { QRScanner } from './QRScanner';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

const handleCodeSubmit = async (e) => {
  e.preventDefault();
  if (!code.trim()) return;

  setLoading(true);
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id;

    if (!userId) {
      toast.error("Nu ești autentificat");
      return;
    }

  await eventUsersAPI.markAttendance(code, userId);
    toast.success("Prezență confirmată!");
    setCode("");
  } catch (error) {
    toast.error("Cod invalid sau eveniment inexistent");
  } finally {
    setLoading(false);
  }
};

  const handleScanSuccess = () => {
    setShowScanner(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bună, {user?.firstName}!
              </h1>
              <p className="text-gray-600">Confirmă-ți prezența la evenimente</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Deconectare</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <QrCode size={40} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Scanează codul QR
              </h2>
              <p className="text-gray-600 mb-6">
                Folosește camera pentru a scana codul QR al evenimentului
              </p>
              <button
                onClick={() => setShowScanner(true)}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Deschide scanner
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <KeyRound size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Introdu codul manual
              </h2>
              <p className="text-gray-600 mb-6">
                Dacă ai primit un cod de acces, introdu-l mai jos
              </p>
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="CONF123"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-xl font-mono uppercase"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                >
                  {loading ? 'Se verifică...' : 'Confirmă prezența'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <div className="flex items-start gap-4">
            <CheckCircle size={24} className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Cum funcționează?</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Scanează codul QR afișat la eveniment sau</li>
                <li>• Introdu manual codul de acces primit de la organizator</li>
                <li>• Vei primi o confirmare imediat după verificare</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
