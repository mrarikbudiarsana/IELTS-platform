import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Target, Calendar, Check, Award } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, updateProfile } = useAuth();

  const [targetBand, setTargetBand] = useState<number>(user?.targetBand || 7.5);
  const [testDate, setTestDate] = useState<string>(
    user?.testDate ? user.testDate.split('T')[0] : ''
  );
  const [testType, setTestType] = useState<string>(
    user?.testTypePreference === 'general' ? 'general' : 'academic'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const bandOptions = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateProfile({
        targetBand,
        testDate: testDate || null,
        testTypePreference: testType,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update IELTS goal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E7E3D9] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-[#FBF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF4F9] text-[#084F7D] flex items-center justify-center">
              <Target className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Set Your IELTS Goal
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Personalise your prep timeline and dashboard targets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Target Band Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#084F7D]" />
              <span>Target Band Score</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bandOptions.map((band) => (
                <button
                  type="button"
                  key={band}
                  onClick={() => setTargetBand(band)}
                  className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${
                    targetBand === band
                      ? 'bg-[#084F7D] text-white border-[#084F7D] shadow-2xs'
                      : 'bg-[#F9F8F5] text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {band.toFixed(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Test Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#084F7D]" />
              <span>Exam Date</span>
            </label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F9F8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#084F7D]/20 text-slate-900 text-sm font-normal"
            />
            <p className="text-[11px] text-slate-400 mt-1 font-normal">
              Used to calculate the days remaining countdown on your dashboard.
            </p>
          </div>

          {/* Module Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              IELTS Module
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTestType('academic')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                  testType === 'academic'
                    ? 'bg-[#EBF4F9] text-[#084F7D] border-[#084F7D]'
                    : 'bg-[#F9F8F5] text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                Academic
              </button>
              <button
                type="button"
                onClick={() => setTestType('general')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                  testType === 'general'
                    ? 'bg-[#EBF4F9] text-[#084F7D] border-[#084F7D]'
                    : 'bg-[#F9F8F5] text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                General Training
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#084F7D] hover:bg-[#063D62] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save IELTS Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
