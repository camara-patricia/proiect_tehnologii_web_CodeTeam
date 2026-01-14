import React, { useState, useEffect } from 'react';
import { X, QrCode, Type, Maximize2, Minimize2 } from 'lucide-react';

export function ProjectorView({ event, onClose }) {
  const [displayMode, setDisplayMode] = useState('both');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(event?.accessCode || '')}`;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-gray-900/80 to-transparent z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-bold text-xl">{event.name}</h2>
          
          <div className="flex items-center bg-white/20 rounded-lg p-1">
            <button
              onClick={() => setDisplayMode('qr')}
              className={`p-2 rounded-lg transition-colors ${
                displayMode === 'qr' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
              }`}
              title="Doar QR Code"
            >
              <QrCode size={20} />
            </button>
            <button
              onClick={() => setDisplayMode('text')}
              className={`p-2 rounded-lg transition-colors ${
                displayMode === 'text' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
              }`}
              title="Doar Text"
            >
              <Type size={20} />
            </button>
            <button
              onClick={() => setDisplayMode('both')}
              className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                displayMode === 'both' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
              }`}
              title="QR + Text"
            >
              Ambele
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title={isFullscreen ? 'Ieși din fullscreen' : 'Fullscreen pentru proiector'}
          >
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title="Închide"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 p-8">
        <div className="text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-8 drop-shadow-lg">
            {event.name}
          </h1>

          <p className="text-white/90 text-xl md:text-2xl mb-8">
            Scanează codul QR sau introdu codul pentru a confirma prezența
          </p>

          <div className={`flex items-center justify-center gap-12 ${
            displayMode === 'both' ? 'flex-col md:flex-row' : ''
          }`}>
            
            {(displayMode === 'qr' || displayMode === 'both') && (
              <div className="bg-white p-6 rounded-3xl shadow-2xl">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code pentru acces" 
                  className="w-64 h-64 md:w-80 md:h-80"
                />
              </div>
            )}

            {displayMode === 'both' && (
              <div className="text-white text-3xl font-bold">sau</div>
            )}

            {(displayMode === 'text' || displayMode === 'both') && (
              <div className="bg-white p-8 rounded-3xl shadow-2xl">
                <p className="text-gray-600 text-lg mb-2">Cod de acces:</p>
                <p className="text-5xl md:text-7xl font-mono font-bold text-purple-600 tracking-widest">
                  {event.accessCode}
                </p>
              </div>
            )}
          </div>

          <p className="text-white/80 text-lg mt-12">
            Apasă <kbd className="px-2 py-1 bg-white/20 rounded">F11</kbd> sau butonul fullscreen pentru modul proiector
          </p>
        </div>
      </div>
    </div>
  );
}
