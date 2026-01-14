import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';
import { eventUsersAPI } from '@/app/services/api.jsx';
import { QrCode, X } from 'lucide-react';

export function QRScanner({ onSuccess, onClose }) {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          async (decodedText) => {
            try {
              // QR poate conține "eventId:accessCode" sau doar "accessCode"
              const accessCode = decodedText.includes(':')
                ? decodedText.split(':')[1]
                : decodedText;

              const user = JSON.parse(localStorage.getItem('user') || 'null');
              const userId = user?.id;
              if (!userId) {
                toast.error('Trebuie să fii autentificat pentru a confirma prezența');
                return;
              }

              await eventUsersAPI.markAttendance(accessCode, userId);

              toast.success('Prezență confirmată!');
              isRunningRef.current = false;
              await scanner.stop();
              onSuccess();
            } catch (error) {
              const msg = error.message || 'Cod invalid sau eveniment inexistent';
              if (msg.toLowerCase().includes('închis')) {
                toast.warning(msg);
              } else {
                toast.error(msg);
              }
            }
          },
          (error) => {
          }
        );

        isRunningRef.current = true;
        setScanning(true);
      } catch (err) {
        console.error('Scanner error:', err);
        toast.error('Nu se poate accesa camera');
        onClose();
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onSuccess, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <QrCode size={24} />
            Scanează codul QR
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div id="qr-reader" className="w-full rounded-lg overflow-hidden"></div>

        {scanning && (
          <p className="text-center text-gray-600 mt-4">
            Poziționează codul QR în fața camerei
          </p>
        )}
      </div>
    </div>
  );
}
