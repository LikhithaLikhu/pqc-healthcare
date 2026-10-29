import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Key, 
  AlertCircle, 
  CheckCircle, 
  Database,
  Globe,
  Sparkles,
  HeartPulse,
  Activity,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { DoctorPatientIllustration } from './illustrations/MedicalIllustrations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin'
}) => {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [requestedRole, setRequestedRole] = useState<UserRole>('patient');
  const [staffInviteCode, setStaffInviteCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { signIn, signUp, dbConnected, dbMessage } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    if (mode === 'signin') {
      const res = await signIn(email, password);
      setSubmitting(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    } else {
      const res = await signUp(email, password, fullName, requestedRole, staffInviteCode);
      setSubmitting(false);
      if (res.success) {
        setSuccessMessage(res.message || 'Account created successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMessage(res.error || 'Failed to complete registration.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col md:flex-row my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Visual Column: Friendly Medical Art & Floating Badges */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#0A192F] via-[#102A45] to-[#1E1B4B] p-6 sm:p-8 text-white relative flex flex-col justify-between overflow-hidden">
          {/* Subtle Floating Shapes */}
          <div className="absolute top-4 right-6 w-32 h-32 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none animate-float" />
          <div className="absolute bottom-6 left-4 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl pointer-events-none animate-float-reverse" />

          {/* Header Info */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>SIH Problem Statement PQC-04</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
              PQC HealthSecure
            </h2>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Post-Quantum authenticated hospital-to-laboratory ecosystem protecting genomic and clinical confidentiality.
            </p>
          </div>

          {/* Friendly Medical Illustration */}
          <div className="relative z-10 my-4 py-2">
            <DoctorPatientIllustration className="w-full max-w-[260px] mx-auto drop-shadow-xl" />
          </div>

          {/* Cryptographic Badges */}
          <div className="relative z-10 space-y-2 pt-2 border-t border-slate-700/60 text-[11px]">
            <div className="flex items-center space-x-2 text-teal-300 font-mono">
              <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>NIST FIPS 203 (ML-KEM-768)</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-300 font-mono">
              <Key className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>NIST FIPS 204 (ML-DSA-65)</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            
            {/* Top Bar: Database Status & In-Modal Language Selector */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-xs">
                <Database className={`w-3.5 h-3.5 ${dbConnected ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className="font-semibold text-slate-700">
                  {dbConnected ? 'Database Connected' : 'Local Test Mode'}
                </span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-100 px-2 py-1 rounded-lg">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t('auth.signInBtn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t('auth.signUpBtn')}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('auth.nameLabel')}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('auth.emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@hospital.org / name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('auth.passwordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Role Selection (Sign Up only) */}
              {mode === 'signup' && (
                <div className="space-y-2.5 pt-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('auth.roleLabel')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRequestedRole('patient')}
                      className={`py-1.5 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        requestedRole === 'patient'
                          ? 'bg-[#0A192F] text-teal-300 border-[#0A192F]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t('nav.patient')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestedRole('doctor')}
                      className={`py-1.5 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        requestedRole === 'doctor'
                          ? 'bg-[#0A192F] text-teal-300 border-[#0A192F]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t('nav.doctor')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestedRole('lab_technician')}
                      className={`py-1.5 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        requestedRole === 'lab_technician'
                          ? 'bg-[#0A192F] text-teal-300 border-[#0A192F]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t('nav.labTechnician')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestedRole('admin')}
                      className={`py-1.5 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        requestedRole === 'admin'
                          ? 'bg-[#0A192F] text-rose-300 border-[#0A192F]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t('nav.adminRole')}
                    </button>
                  </div>

                  {/* Security Alert for Privileged Staff Roles */}
                  {requestedRole !== 'patient' && (
                    <div className="p-2.5 bg-teal-50/80 border border-teal-200 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center space-x-1.5 text-teal-900 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>Staff Verification Required</span>
                      </div>
                      <p className="text-[11px] text-teal-800 leading-tight">
                        Privileged role accounts require an authorization invite code. (Demo code: <code className="bg-white px-1 rounded font-mono font-bold text-slate-900">{requestedRole === 'doctor' ? 'HOSPITAL-DOC-2026' : requestedRole === 'lab_technician' ? 'LAB-ASSIST-2026' : 'HOSPITAL-ADMIN-2026'}</code>)
                      </p>
                      <div className="relative pt-1">
                        <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Enter invite code"
                          value={staffInviteCode}
                          onChange={(e) => setStaffInviteCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-teal-300 text-xs bg-white text-slate-800 outline-none focus:border-teal-500 font-mono"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Message Alert */}
              {successMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {submitting ? 'Authenticating...' : mode === 'signin' ? t('auth.signInBtn') : t('auth.signUpBtn')}
              </button>
            </form>
          </div>

          {/* Quick Mock Login Helper Note */}
          <div className="pt-4 mt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Hackathon Demonstration: You can test all roles immediately using the <strong>Role Quick Switcher</strong> in the top navigation.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
