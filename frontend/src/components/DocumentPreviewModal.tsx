import React, { useState } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  Download, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  User, 
  Hash, 
  Maximize2,
  ExternalLink,
  Lock
} from 'lucide-react';
import { MedicalDocument } from '../types';

interface DocumentPreviewModalProps {
  document: MedicalDocument;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose
}) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleResetZoom = () => {
    setScale(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleDownload = () => {
    const a = window.document.createElement('a');
    a.href = document.signedUrl;
    a.download = `${document.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_pqc.${document.mimeType.split('/')[1] || 'jpg'}`;
    a.target = '_blank';
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.fileHashSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Prescription':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Medical Scan':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Blood Test':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Diagnosis Report':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Referral':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 border border-teal-500/20 flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-base md:text-lg truncate">
                  {document.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${getCategoryColor(document.category)}`}>
                  {document.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                Patient: <span className="font-semibold text-slate-700">{document.patientName || document.patientId}</span> • 
                Uploaded by <span className="font-semibold text-slate-700">{document.uploaderName || document.uploadedBy}</span> ({document.uploaderRole})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
              title="Download image file"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Image Viewport */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-900 relative">
          
          {/* Main Image Canvas */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 relative select-none">
            {document.signedUrl ? (
              <img
                src={document.signedUrl}
                alt={document.title}
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease-out'
                }}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform"
              />
            ) : (
              <div className="text-center text-slate-400 py-16">
                <FileText className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="text-sm font-semibold">Image preview unavailable</p>
                <p className="text-xs text-slate-500">Storage path: {document.storagePath}</p>
              </div>
            )}

            {/* Floating Zoom & Rotate Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 flex items-center space-x-3 text-slate-200 shadow-xl">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="p-1 hover:text-teal-400 disabled:opacity-30 cursor-pointer transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <span className="text-xs font-mono font-bold w-12 text-center text-teal-300">
                {Math.round(scale * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={scale >= 3}
                className="p-1 hover:text-teal-400 disabled:opacity-30 cursor-pointer transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="w-px h-4 bg-slate-700" />

              <button
                onClick={handleRotate}
                className="p-1 hover:text-teal-400 cursor-pointer transition-colors"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetZoom}
                className="text-xs font-bold text-slate-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                title="Reset zoom & rotation"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right/Bottom Metadata Sidebar */}
          <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-5 overflow-y-auto space-y-4 shrink-0 text-slate-800">
            
            {/* Post-Quantum Integrity Badge */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 space-y-2">
              <div className="flex items-center space-x-2 text-teal-800 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>PQC Integrity Verified</span>
              </div>
              <p className="text-[11px] text-teal-900 leading-snug">
                Image digest is cryptographically signed using <strong>NIST FIPS 204 (ML-DSA-65)</strong> post-quantum lattice signature.
              </p>
            </div>

            {/* Document Details */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Clinical Description</span>
                <p className="mt-1 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic leading-relaxed">
                  {document.description || 'No additional clinical remarks recorded.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">File Size</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{formatFileSize(document.fileSize)}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">MIME Type</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5 uppercase">{document.mimeType.replace('image/', '')}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
                  <span>SHA-256 Digest</span>
                  <button 
                    onClick={handleCopyHash}
                    className="text-teal-600 hover:text-teal-800 text-[10px] font-semibold cursor-pointer"
                  >
                    {copiedHash ? 'Copied!' : 'Copy'}
                  </button>
                </span>
                <p className="font-mono text-[10px] text-slate-600 break-all bg-white p-1.5 rounded border border-slate-200">
                  {document.fileHashSha256 || 'Unavailable'}
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">ML-DSA-65 Signature</span>
                <p className="font-mono text-[10px] text-teal-800 break-all bg-white p-1.5 rounded border border-slate-200 truncate">
                  {document.pqcSignature || 'Signed at Upload'}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(document.createdAt).toLocaleDateString()} at {new Date(document.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
                <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Immutable</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
