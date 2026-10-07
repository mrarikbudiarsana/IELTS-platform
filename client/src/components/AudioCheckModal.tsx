import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, CheckCircle2, Headphones, X } from 'lucide-react';

interface AudioCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStart: () => void;
  testTitle: string;
}

export const AudioCheckModal: React.FC<AudioCheckModalProps> = ({
  isOpen,
  onClose,
  onConfirmStart,
  testTitle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.error(e));
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const handleConfirm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    onConfirmStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-indigo-600/40 border border-indigo-400/40 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Headphones className="w-7 h-7 text-indigo-300" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Audio & Volume Calibration</h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-xs mx-auto">
            Please put on your headphones and ensure you can hear the sound clearly before beginning.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Sample audio element */}
          <audio
            ref={audioRef}
            src="/audio/listening_part1_car_rental.wav"
            onEnded={() => setIsPlaying(false)}
          />

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Test Audio Playback
            </div>
            <button
              onClick={togglePlay}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto transition-all shadow-xs ${
                isPlaying
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  Pause Audio
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Play Sound Sample
                </>
              )}
            </button>
            <div className="text-[11px] text-slate-400 mt-2 font-medium">
              Sample: Spoken English voice introduction
            </div>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
                Headphone Volume
              </span>
              <span className="font-mono text-indigo-600">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
            <strong>Exam Note:</strong> In mock mode, playback is controlled automatically according to official timing phases. Seeking and ordinary replay are locked during the exam rehearsal.
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Begin Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
