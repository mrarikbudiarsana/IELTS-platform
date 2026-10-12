import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle, X } from 'lucide-react';

interface ElevateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElevateModal: React.FC<ElevateModalProps> = ({ isOpen, onClose }) => {
  const { user, elevateRole } = useAuth();
  const [role, setRole] = useState<'teacher' | 'admin'>('teacher');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || user?.role !== 'admin') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await elevateRole(undefined, role);
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
            Role Settings
          </div>
          <button onClick={onClose} className="text-amber-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Choose the role for your administrator account.
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
