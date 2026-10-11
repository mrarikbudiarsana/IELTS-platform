import React, { useState, useRef } from 'react';
import { Upload, Music, Image as ImageIcon, Loader2, CheckCircle2, X, ExternalLink, AlertCircle } from 'lucide-react';

interface CloudinaryMediaUploaderProps {
  mediaType: 'audio' | 'image';
  currentUrl?: string;
  onUploadSuccess: (secureUrl: string) => void;
  onClear?: () => void;
  label?: string;
  helperText?: string;
  folder?: string;
  className?: string;
}

export const CloudinaryMediaUploader: React.FC<CloudinaryMediaUploaderProps> = ({
  mediaType,
  currentUrl,
  onUploadSuccess,
  onClear,
  label,
  helperText,
  folder,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState(currentUrl || '');
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'pkwpxicd';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ielts_student_uploads';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      setErrorMessage('Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET) are missing.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);
      setUploadProgress(10);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      if (folder) {
        formData.append('folder', folder);
      }

      // Cloudinary upload endpoint - 'auto' handles both audio and images smoothly
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      const secureUrl = data.secure_url || data.url;

      if (!secureUrl) {
        throw new Error('Cloudinary response did not return a valid secure_url.');
      }

      setUploadProgress(100);
      setManualUrl(secureUrl);
      onUploadSuccess(secureUrl);
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setErrorMessage(err.message || 'Failed to upload media to Cloudinary.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleManualApply = () => {
    if (manualUrl.trim()) {
      onUploadSuccess(manualUrl.trim());
      setShowManualInput(false);
    }
  };

  const handleRemove = () => {
    setManualUrl('');
    if (onClear) {
      onClear();
    } else {
      onUploadSuccess('');
    }
  };

  const isAudio = mediaType === 'audio';
  const acceptedTypes = isAudio ? 'audio/*,.mp3,.wav,.ogg,.m4a,.webm' : 'image/*,.png,.jpg,.jpeg,.webp,.svg';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium underline"
          >
            {showManualInput ? 'Hide URL input' : 'Or paste direct URL'}
          </button>
        </div>
      )}

      {/* Manual URL fallback */}
      {showManualInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder={isAudio ? 'https://res.cloudinary.com/.../audio.mp3' : 'https://res.cloudinary.com/.../image.png'}
            className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="button"
            onClick={handleManualApply}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      )}

      {/* Upload trigger & Preview bar */}
      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/80">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
        />

        {currentUrl ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`p-1.5 rounded-lg ${isAudio ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {isAudio ? <Music className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 truncate">Media uploaded</span>
                  </div>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-mono truncate block flex items-center gap-1"
                    title={currentUrl}
                  >
                    <span className="truncate">{currentUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-3 shrink-0">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md"
                  title="Remove media"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Media Live Preview */}
            {isAudio ? (
              <div className="bg-white p-2 border border-slate-200 rounded-lg">
                <audio controls src={currentUrl} className="w-full h-8" preload="metadata">
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <div className="bg-white p-2 border border-slate-200 rounded-lg flex justify-center">
                <img
                  src={currentUrl}
                  alt="Preview"
                  className="max-h-48 max-w-full rounded object-contain border border-slate-100"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isAudio ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {isAudio ? <Music className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {isAudio ? 'No audio track uploaded' : 'No image uploaded'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {helperText || (isAudio ? 'Upload MP3, WAV, M4A or OGG to Cloudinary' : 'Upload PNG, JPG, WebP or SVG to Cloudinary')}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isAudio ? 'Upload Audio to Cloudinary' : 'Upload Image to Cloudinary'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Upload error banner */}
        {errorMessage && (
          <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Upload failed: </span>
              {errorMessage}
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
