import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, KeyRound, AlertCircle, CheckCircle, X } from 'lucide-react';

interface ElevateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElevateModal: React.FC<ElevateModalProps> = ({ isOpen, onClose }) => {
  const { elevateRole } = useAuth();
  const [secretKey, setSecretKey] = useState('arik-teacher-grant-2026');
  const [role, setRole] = useState<'teacher' | 'admin'>('teacher');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await elevateRole(secretKey, role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Privilege elevation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 bg-amber-950 text-amber-200">
          <div className="font-bold text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Protected Teacher Elevation
          </div>
          <button onClick={onClose} className="text-amber-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Per the system blueprint, public accounts cannot self-assign teacher or administrative roles. Enter the teacher bootstrap key to authorize privileged content authoring.
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Desired Privilege Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="teacher">Teacher (Author Tests & Review Submissions)</option>
              <option value="admin">Administrator (Full Access & User Management)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Security Setup Key
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter teacher bootstrap key"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Default pilot key: <code className="text-amber-700 font-mono">arik-teacher-grant-2026</code>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-sm shadow transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Authorize Role Elevation'}
          </button>
        </form>
      </div>
    </div>
  );
};
